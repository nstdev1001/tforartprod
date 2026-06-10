import { albumSchema } from "@/schema/albumSchema";
import { AlbumData } from "@/types/albumDataType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import NProgress from "nprogress";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type UseControlAlbumOptions = {
  albumId?: string;
  fetchAlbums?: boolean;
};

const useControlAlbum = ({
  albumId,
  fetchAlbums = true,
}: UseControlAlbumOptions = {}) => {
  const db = getFirestore();
  const queryClient = useQueryClient();
  const storage = getStorage();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { data: albums, isPending } = useQuery<AlbumData[]>({
    queryKey: ["albumCollection"],
    queryFn: async () => {
      const q = query(
        collection(db, "albumCollection"),
        orderBy("position", "asc"),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        position: (doc.data() as AlbumData).position || Number.MIN_SAFE_INTEGER,
      })) as AlbumData[];
    },
    enabled: fetchAlbums,
  });

  const { data: albumInfo, isPending: isAlbumInfoPending } = useQuery<
    AlbumData | undefined
  >({
    queryKey: ["albumCollection", "detail", albumId],
    queryFn: async () => {
      if (!albumId) return undefined;

      const cachedAlbums = queryClient.getQueryData<AlbumData[]>([
        "albumCollection",
      ]);
      const cachedAlbum = cachedAlbums?.find((album) => album.id === albumId);
      if (cachedAlbum) {
        return cachedAlbum;
      }

      const albumRef = doc(db, "albumCollection", albumId);
      const snapshot = await getDoc(albumRef);
      if (!snapshot.exists()) {
        return undefined;
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
        position:
          (snapshot.data() as AlbumData).position || Number.MIN_SAFE_INTEGER,
      } as AlbumData;
    },
    enabled: !!albumId,
  });

  const form = useForm<z.infer<typeof albumSchema>>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      albumTitle: "",
      albumDescription: "",
    },
  });

  const { watch } = form;

  const uploadImage = async (file: File, albumId: string) => {
    const storageRef = ref(storage, `images/${albumId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (uploadError) => {
          console.error(uploadError.message);
          reject(uploadError);
        },
        () => {
          void (async () => {
            try {
              const url = await getDownloadURL(storageRef);
              resolve(url);
            } catch (getUrlError) {
              console.error(
                getUrlError instanceof Error
                  ? getUrlError.message
                  : String(getUrlError),
              );
              reject(
                getUrlError instanceof Error
                  ? getUrlError
                  : new Error(String(getUrlError)),
              );
            }
          })();
        },
      );
    });
  };

  const addAlbumMutation = useMutation({
    mutationFn: async (thumbnailFile: File) => {
      NProgress.start();
      toast.loading("Creating album... Wait a minute!");
      const { albumTitle, albumDescription } = form.getValues();

      // Find the minimum position (could be negative)
      let minPosition = 0;
      if (albums && albums.length > 0) {
        minPosition = Math.min(...albums.map((album) => album.position || 0));
      }

      // Create a new document with a position one less than the minimum
      const docRef = await addDoc(collection(db, "albumCollection"), {
        albumTitle,
        albumDescription: albumDescription || null,
        position: minPosition - 1, // Use a value lower than the current minimum
        createdAt: serverTimestamp(),
      });

      // Use the albumId to upload the thumbnail image
      const uploadThumb = await uploadImage(thumbnailFile, docRef.id);

      // Update the document with the uploaded thumbnail URL
      await updateDoc(docRef, { thumbnailUrl: uploadThumb });

      const thumbnailUrl = uploadThumb;
      return {
        id: docRef.id,
        albumTitle,
        thumbnailUrl,
        position: minPosition - 1,
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["albumCollection"] });
      NProgress.done();
      form.reset();
    },
    onError: (error) => {
      toast.error("Create album failed! Please try again.");
      console.error(error);
    },
  });

  const editAlbumMutation = useMutation({
    mutationFn: async ({
      albumId,
      updatedData,
      thumbnailFile,
      oldThumbnailUrl,
    }: {
      albumId: string | undefined;
      updatedData: Partial<AlbumData>;
      thumbnailFile?: File;
      oldThumbnailUrl?: string;
    }) => {
      NProgress.start();
      if (!albumId) {
        return undefined;
      }

      const albumRef = doc(db, "albumCollection", albumId);
      const cachedAlbum = queryClient.getQueryData<AlbumData>([
        "albumCollection",
        "detail",
        albumId,
      ]);
      const collectionAlbum = queryClient
        .getQueryData<AlbumData[]>(["albumCollection"])
        ?.find((album) => album.id === albumId);
      const currentAlbum = cachedAlbum || collectionAlbum;

      let thumbnailUrl = oldThumbnailUrl ?? currentAlbum?.thumbnailUrl;
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile, albumId);
      }

      const nextAlbum = {
        ...currentAlbum,
        ...updatedData,
        id: albumId,
        thumbnailUrl,
      } as AlbumData;

      const { ...dataToPersist } = nextAlbum;

      await updateDoc(albumRef, dataToPersist);
      return nextAlbum;
    },
    onSuccess: async (updatedAlbum) => {
      if (updatedAlbum?.id) {
        queryClient.setQueryData<AlbumData | undefined>(
          ["albumCollection", "detail", updatedAlbum.id],
          updatedAlbum,
        );
        queryClient.setQueryData<AlbumData[] | undefined>(
          ["albumCollection"],
          (previousAlbums) =>
            previousAlbums?.map((album) =>
              album.id === updatedAlbum.id
                ? { ...album, ...updatedAlbum }
                : album,
            ),
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["albumCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      toast.error("Update album failed! Please try again.");
      console.error(error);
    },
  });

  const deleteAllFiles = async (folderRef: ReturnType<typeof ref>) => {
    const listResult = await listAll(folderRef);
    const deleteFiles = listResult.items.map((item) => deleteObject(item));
    const deleteSubFolders = listResult.prefixes.map((prefix) =>
      deleteAllFiles(prefix),
    );
    await Promise.all([...deleteFiles, ...deleteSubFolders]);
  };

  const deleteAlbumMutation = useMutation({
    mutationFn: async (albumId: string) => {
      if (albumId) {
        NProgress.start();
        const albumRef = ref(storage, `images/${albumId}`);
        //delete all images in the album (including sub-folders)
        await deleteAllFiles(albumRef);
        return deleteDoc(doc(db, "albumCollection", albumId));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["albumCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      toast.error("Delete album failed! Please try again.");
      console.error(error);
    },
  });

  const updateAlbumPositionMutation = useMutation({
    mutationFn: async (position: AlbumData[]) => {
      NProgress.start();
      const batch = writeBatch(db);

      position.forEach((item) => {
        const albumRef = doc(db, "albumCollection", item.id);
        batch.update(albumRef, { position: item.position });
      });
      return batch.commit();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["albumCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      NProgress.done();
      toast.error("Failed to update album position!");
      console.error(error);
    },
  });

  function toUrlSlug(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const onSubmit = async (thumbnailFile: File) => {
    if (!thumbnailFile) {
      throw new Error("No file provided");
    }

    await form.handleSubmit(() => {
      addAlbumMutation.mutate(thumbnailFile);
    })();
  };

  return {
    toUrlSlug,
    form,
    watch,
    onSubmit,
    isPending,
    isAlbumInfoPending,
    albums,
    albumInfo,
    deleteAlbumMutation,
    editAlbumMutation,
    uploadProgress,
    updateAlbumPositionMutation,
  };
};

export default useControlAlbum;

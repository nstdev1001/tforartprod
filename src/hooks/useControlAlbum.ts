import { albumSchema } from "@/schema/albumSchema";
import { AlbumData } from "@/types/albumDataType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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

const useControlAlbum = () => {
  const db = getFirestore();
  const queryClient = useQueryClient();
  const storage = getStorage();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { data: albums, isPending } = useQuery<AlbumData[]>({
    queryKey: ["albumCollection"],
    queryFn: async () => {
      const q = query(
        collection(db, "albumCollection"),
        orderBy("position", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        position: (doc.data() as AlbumData).position || Number.MIN_SAFE_INTEGER,
      })) as AlbumData[];
    },
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
                  : String(getUrlError)
              );
              reject(
                getUrlError instanceof Error
                  ? getUrlError
                  : new Error(String(getUrlError))
              );
            }
          })();
        }
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
      toast.success("Add album successfully!");
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
      if (albumId) {
        const albumRef = doc(db, "albumCollection", albumId);
        const { ...dataToUpdate } = updatedData;

        if (thumbnailFile) {
          const newThumbnailUrl = await uploadImage(thumbnailFile, albumId);
          return updateDoc(albumRef, {
            ...dataToUpdate,
            thumbnailUrl: newThumbnailUrl,
          });
        } else {
          const thumbnailUrl = oldThumbnailUrl;
          return updateDoc(albumRef, {
            ...updatedData,
            thumbnailUrl,
          });
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["albumCollection"] });
      NProgress.done();
      toast.success("Update successfully!");
    },
    onError: (error) => {
      toast.error("Update album failed! Please try again.");
      console.error(error);
    },
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: async (albumId: string) => {
      if (albumId) {
        NProgress.start();
        const albumRef = ref(storage, `images/${albumId}`);

        //list all images in the album
        const listResult = await listAll(albumRef);

        //delete all images in the album
        const deleteImages = listResult.items.map((item) => deleteObject(item));
        await Promise.all(deleteImages);

        //delete the album
        return deleteDoc(doc(db, "albumCollection", albumId));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["albumCollection"] });
      NProgress.done();
      toast.success("Delete album successfully!");
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
    albums,
    deleteAlbumMutation,
    editAlbumMutation,
    uploadProgress,
    updateAlbumPositionMutation,
  };
};

export default useControlAlbum;

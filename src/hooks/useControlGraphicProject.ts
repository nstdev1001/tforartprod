import { graphicProjectSchema } from "@/schema/graphicProjectSchema";
import { GraphicProjectData } from "@/types/graphicDataType";
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

const useControlGraphicProject = () => {
  const db = getFirestore();
  const queryClient = useQueryClient();
  const storage = getStorage();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { data: projects, isPending } = useQuery<GraphicProjectData[]>({
    queryKey: ["graphicCollection"],
    queryFn: async () => {
      const q = query(
        collection(db, "graphicCollection"),
        orderBy("position", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        position:
          (doc.data() as GraphicProjectData).position ||
          Number.MIN_SAFE_INTEGER,
      })) as GraphicProjectData[];
    },
  });

  const form = useForm<z.infer<typeof graphicProjectSchema>>({
    resolver: zodResolver(graphicProjectSchema),
    defaultValues: {
      projectTitle: "",
      projectDescription: "",
    },
  });

  const { watch } = form;

  const uploadImage = async (file: File, collectionId: string) => {
    const storageRef = ref(storage, `graphics/${collectionId}/${file.name}`);
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

  const addProjectMutation = useMutation({
    mutationFn: async (thumbnailFile: File) => {
      NProgress.start();
      toast.loading("Creating project... Wait a minute!");
      const { projectTitle, projectDescription } = form.getValues();

      // Find the minimum position (could be negative)
      let minPosition = 0;
      if (projects && projects.length > 0) {
        minPosition = Math.min(
          ...projects.map((project) => project.position || 0)
        );
      }

      // Create a new document with a position one less than the minimum
      const docRef = await addDoc(collection(db, "graphicCollection"), {
        projectTitle,
        projectDescription: projectDescription || null,
        isRoundedImage: true,
        gapImage: "mb-4",
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
        projectTitle,
        thumbnailUrl,
        position: minPosition - 1,
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["graphicCollection"] });
      NProgress.done();
      form.reset();
    },
    onError: (error) => {
      toast.error("Create project failed! Please try again.");
      console.error(error);
    },
  });

  const editProjectMutation = useMutation({
    mutationFn: async ({
      projectId,
      updatedData,
      thumbnailFile,
      oldThumbnailUrl,
      isRoundedImage,
      gapImage,
    }: {
      projectId: string | undefined;
      updatedData: Partial<GraphicProjectData>;
      thumbnailFile?: File;
      oldThumbnailUrl?: string;
      isRoundedImage?: boolean;
      gapImage?: string;
    }) => {
      NProgress.start();
      if (projectId) {
        const albumRef = doc(db, "graphicCollection", projectId);
        if (thumbnailFile) {
          const newThumbnailUrl = await uploadImage(thumbnailFile, projectId);
          return updateDoc(albumRef, {
            ...updatedData,
            thumbnailUrl: newThumbnailUrl,
          });
        } else {
          return updateDoc(albumRef, {
            ...updatedData,
            thumbnailUrl: oldThumbnailUrl,
            isRoundedImage,
            gapImage,
          });
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["graphicCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      toast.error("Update project failed! Please try again.");
      console.error(error);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      if (collectionId) {
        NProgress.start();
        const albumRef = ref(storage, `graphics/${collectionId}`);

        //list all images in the collection
        const listResult = await listAll(albumRef);

        //delete all images in the collection
        const deleteImages = listResult.items.map((item) => deleteObject(item));
        await Promise.all(deleteImages);

        //delete the collection
        return deleteDoc(doc(db, "graphicCollection", collectionId));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["graphicCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      toast.error("Delete project failed! Please try again.");
      console.error(error);
    },
  });

  const updateProjectPositionMutation = useMutation({
    mutationFn: async (position: GraphicProjectData[]) => {
      NProgress.start();
      const batch = writeBatch(db);

      position.forEach((item) => {
        const albumRef = doc(db, "graphicCollection", item.id);
        batch.update(albumRef, { position: item.position });
      });
      return batch.commit();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["graphicCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      NProgress.done();
      toast.error("Failed to update project position!");
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
      addProjectMutation.mutate(thumbnailFile);
    })();
  };

  return {
    toUrlSlug,
    form,
    watch,
    onSubmit,
    isPending,
    projects,
    deleteProjectMutation,
    editProjectMutation,
    uploadProgress,
    updateProjectPositionMutation,
  };
};

export default useControlGraphicProject;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import NProgress from "nprogress";
import { useState } from "react";
import toast from "react-hot-toast";

const useGraphicUploader = (albumBucket: string) => {
  const storage = getStorage();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: photos, isLoading } = useQuery<string[]>({
    queryKey: ["graphicsCollection", albumBucket],
    queryFn: async () => {
      if (!albumBucket) return [];

      const imagesRef = ref(storage, `graphics/${albumBucket}/all`);
      const result = await listAll(imagesRef);

      const filesWithMetadata = await Promise.all(
        result.items.map(async (itemRef) => {
          const [url, metadata] = await Promise.all([
            getDownloadURL(itemRef),
            getMetadata(itemRef),
          ]);
          return {
            url,
            timeCreated: new Date(metadata.timeCreated), // Convert to Date for sorting
          };
        })
      );

      console.log("filesWithMetadata", filesWithMetadata);

      // Sort by timeCreated ascending (oldest first, newest last)
      filesWithMetadata.sort(
        (a, b) => a.timeCreated.getTime() - b.timeCreated.getTime()
      );

      // Return only the URLs
      return filesWithMetadata.map((file) => file.url);
    },
    enabled: !!albumBucket,
  });

  const uploadImage = async (
    file: File,
    albumBucket: string
  ): Promise<string> => {
    setError(null);

    const storageRef = ref(storage, `graphics/${albumBucket}/all/${file.name}`);
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
          setError(uploadError.message);
          reject(uploadError);
        },
        () => {
          getDownloadURL(storageRef)
            .then((url) => {
              resolve(url);
            })
            .catch((getUrlError: Error) => {
              setError(getUrlError.message);
              reject(getUrlError);
            });
        }
      );
    });
  };

  const uploadImagesMutation = useMutation({
    mutationFn: async (selectedPhotos: File[]) => {
      NProgress.start();
      if (!selectedPhotos.length) return;

      setIsUploading(true);
      await Promise.all(
        selectedPhotos.map((file) => uploadImage(file, albumBucket))
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["graphicsCollection"] });
      NProgress.done();
      setIsOpen(false);
      setUploadProgress(0);
    },
    onError: (error) => {
      console.error("Error uploading images:", error);
      toast.error("Upload photos failed! Please try again");
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (urls: string | string[]) => {
      NProgress.start();
      const urlArray = typeof urls === "string" ? [urls] : urls;

      await Promise.all(
        urlArray.map((url) => {
          const decodedPath = decodeURIComponent(
            url.split("/o/")[1].split("?")[0]
          );
          const fileRef = ref(storage, decodedPath);
          return deleteObject(fileRef);
        })
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["graphicsCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      console.error("Error delete images:", error);
      toast.error("Delete photos failed! Please try again");
    },
  });

  const toUrlSlug = (str: string): string => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  return {
    toUrlSlug,
    uploadImage,
    uploadProgress,
    error,
    deletePhotoMutation,
    photos,
    isLoading,
    uploadImagesMutation,
    isOpen,
    isUploading,
    setIsOpen,
  };
};

export default useGraphicUploader;

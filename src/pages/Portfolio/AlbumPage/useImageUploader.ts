import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import toast from "react-hot-toast";

const useImageUploader = (
  albumBucket: string,
  setSelectedPhotos?: (photos: File[]) => void
) => {
  const storage = getStorage();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: photos, isLoading } = useQuery<string[]>({
    queryKey: ["photosCollection", albumBucket],
    queryFn: async () => {
      if (!albumBucket) return [];
      const imagesRef = ref(storage, `images/${albumBucket}/all`);
      const result = await listAll(imagesRef);

      return Promise.all(
        result.items.map((itemRef) => getDownloadURL(itemRef))
      );
    },
    enabled: !!albumBucket,
  });

  const uploadImage = async (
    file: File,
    albumBucket: string
  ): Promise<string> => {
    setError(null);

    const storageRef = ref(storage, `images/${albumBucket}/all/${file.name}`);
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
      void queryClient.invalidateQueries({ queryKey: ["photosCollection"] });
      NProgress.done();

      if (setSelectedPhotos) {
        setSelectedPhotos([]);
      }

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
      void queryClient.invalidateQueries({ queryKey: ["photosCollection"] });
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
    setUploadProgress,
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

export default useImageUploader;

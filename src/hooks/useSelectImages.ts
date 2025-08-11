import imageCompression from "browser-image-compression";
import { useEffect, useState } from "react";

type UseSelectImagesProps = {
  isThumbnail?: boolean;
  initialImageUrl?: string;
};

export const useSelectImages = ({
  isThumbnail = false,
  initialImageUrl,
}: UseSelectImagesProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialImageUrl ? [initialImageUrl] : []
  );
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (initialImageUrl && selectedFiles.length === 0) {
      setPreviewUrls([initialImageUrl]);
      return;
    }
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles, initialImageUrl]);

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void (async () => {
      if (e.target.files && e.target.files.length > 0) {
        setIsCompressing(true);
        const filesArray = Array.from(e.target.files);

        const compressedFiles = await Promise.all(
          filesArray.map((file) => compressImage(file))
        );

        setSelectedFiles(isThumbnail ? [compressedFiles[0]] : compressedFiles);
        setIsCompressing(false);
      }
    })();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    void (async () => {
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        setIsCompressing(true);
        const filesArray = Array.from(event.dataTransfer.files);

        const compressedFiles = await Promise.all(
          filesArray.map((file) => compressImage(file))
        );

        setSelectedFiles(isThumbnail ? [compressedFiles[0]] : compressedFiles);
        setIsCompressing(false);
      }
    })();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return {
    selectedFiles,
    previewUrls,
    setSelectedFiles,
    setPreviewUrls,
    handleDrop,
    handleDragOver,
    handleFileChange,
    isCompressing,
  };
};

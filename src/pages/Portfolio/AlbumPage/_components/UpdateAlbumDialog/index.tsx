import styles from "./style.module.css";
import CompressImageLoading from "@/components/Loading/CompressImageLoading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useControlAlbum from "@/hooks/useControlAlbum";
import { useSelectImages } from "@/hooks/useSelectImages";
import { AlbumData } from "@/types/albumDataType";
import { useEffect } from "react";

interface Props {
  albumData: AlbumData | null;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateAlbumDialog = ({ albumData, isOpen, onClose }: Props) => {
  const { form, watch, editAlbumMutation, isPending } = useControlAlbum();

  const albumTitle = watch("albumTitle");
  const albumDescription = watch("albumDescription");

  useEffect(() => {
    if (isOpen && albumData) {
      form.setValue("albumTitle", albumData.albumTitle);
      form.setValue("albumDescription", albumData.albumDescription || "");
    }
  }, [albumData, form, isOpen]);

  const {
    handleDragOver,
    handleDrop,
    handleFileChange,
    selectedFiles,
    previewUrls,
    setSelectedFiles,
    setPreviewUrls,
    isCompressing,
  } = useSelectImages({
    isThumbnail: true,
    initialImageUrl: albumData?.thumbnailUrl,
  });

  const handleClose = () => {
    form.reset();
    setSelectedFiles([]);
    setPreviewUrls(albumData?.thumbnailUrl ? [albumData.thumbnailUrl] : []);
    onClose();
  };

  const handleUpdateAlbum = () => {
    const formValues = form.getValues();
    const updatedData = {
      ...formValues,
      albumDescription: formValues.albumDescription || null,
    };

    const mutationData =
      selectedFiles.length > 0
        ? {
            albumId: albumData?.id,
            updatedData,
            thumbnailFile: selectedFiles[0],
          }
        : {
            albumId: albumData?.id,
            updatedData,
            oldThumbnailUrl: albumData?.thumbnailUrl,
          };

    editAlbumMutation.mutate(mutationData);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-fit !max-w-fit flex justify-between gap-[80px]"
        aria-describedby={undefined}
      >
        <div className="add-box w-[400px] flex flex-col gap-8">
          <DialogTitle className="text-center text-2xl font-semibold">
            Cập nhật album
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit(handleUpdateAlbum)();
              }}
              className="flex flex-col gap-8"
            >
              <FormField
                control={form.control}
                name="albumTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tiêu đề album"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="albumDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả album (không bắt buộc)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div
                className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 border-2 border-dashed border-gray-500 rounded-lg"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {isCompressing ? (
                  <div className="loading-effect flex flex-col gap-1 items-center">
                    <CompressImageLoading />
                    <p>Đang nén ảnh...</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 items-center">
                    <p className="text-lg text-gray-600 text-center w-52">
                      Kéo và thả file để tải Ảnh thumbnail
                    </p>
                    <span className="text-gray-500 text-sm">- hoặc -</span>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition"
                    >
                      Chọn tệp
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 w-full">
                    <h4 className="text-gray-700 font-medium">Tệp đã chọn:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {selectedFiles.map((file, index) => (
                        <li key={`${file.name}-${index}`}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button className="w-full" type="submit" disabled={isPending}>
                Cập nhật album
              </Button>
            </form>
          </Form>
        </div>
        <div className="preview-album flex flex-col items-center justify-center gap-8">
          <h1 className="text-center text-2xl">Xem trước album</h1>
          <div className={`${styles.album} relative`}>
            {previewUrls.length > 0 ? (
              <>
                <img
                  src={previewUrls[0]}
                  alt={selectedFiles[0]?.name || "Album thumbnail"}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className={styles.overlay}>
                  <h3 className={styles.title}>{albumTitle}</h3>
                </div>
              </>
            ) : (
              <p className="text-gray-600">Chưa có ảnh để hiển thị</p>
            )}
          </div>
          <div className="preview-description max-w-[384px]">
            <h3 className="text-center font-bold">Mô tả:</h3>
            <p className="w-[384px] overflow-hidden text-ellipsis text-center">
              {!albumDescription?.trim() ? (
                <span className="text-gray-600">(Chưa có mô tả)</span>
              ) : (
                albumDescription
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAlbumDialog;

import styles from "./style.module.css";
import CompressImageLoading from "@/components/Loading/CompressImageLoading";
import LineSpinerLoading from "@/components/Loading/LineSpinerLoading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";

const AddAlbumDialog = () => {
  const { form, watch, isPending, onSubmit } = useControlAlbum();
  const [isOpen, setIsOpen] = useState(false);
  const {
    handleDragOver,
    handleDrop,
    handleFileChange,
    selectedFiles,
    previewUrls,
    setSelectedFiles,
    setPreviewUrls,
    isCompressing,
  } = useSelectImages({ isThumbnail: true });

  const albumTitle = watch("albumTitle");
  const albumDescription = watch("albumDescription");

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [isOpen, form, setSelectedFiles, setPreviewUrls]);

  const handleClose = () => {
    form.reset();
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsOpen(false);
  };

  const handleSubmitAddAlbum = async () => {
    try {
      if (!selectedFiles || selectedFiles.length === 0) {
        console.error("No file selected");
        return;
      }
      for (const file of selectedFiles) {
        await onSubmit(file);
      }
      handleClose();
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}
    >
      <DialogTrigger
        disabled={isPending}
        className="cursor-pointer hidden md:block p-3 border rounded-lg"
      >
        <i className="fa-regular fa-plus text-3xl"></i>
      </DialogTrigger>

      <DialogContent
        className="w-fit md:scale-75 lg:scale-100 max-w-fit flex justify-between gap-[80px]"
        aria-describedby={undefined}
      >
        <div className="add-box w-[400px] flex flex-col gap-8">
          <DialogTitle className="text-center text-xl">
            Tạo mới album
          </DialogTitle>

          {/* Phần mô tả được tham chiếu bởi aria-describedby */}
          <p id="add-album-description" className="sr-only">
            Fill in the form to create a new album. You can upload an image or
            video and provide a title and description.
          </p>

          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit(handleSubmitAddAlbum)();
              }}
              className="space-y-8 flex flex-col"
            >
              <FormField
                control={form.control}
                name="albumTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tên album"
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
                    <FormLabel>Mô tả</FormLabel>
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
                className="flex flex-col gap-10 items-center justify-center w-full max-w-lg mx-auto p-6 border-2 border-dashed border-gray-500 rounded-lg"
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
                      Kéo và thả file để tải Thumnnail
                    </p>
                    <span className="text-gray-500 text-sm">- or -</span>
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

                {selectedFiles && (
                  <div className="selected-file-section w-full">
                    <h4 className="text-gray-700 font-medium">
                      Selected Files:
                    </h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {selectedFiles.map((file, index) => (
                        <p
                          className="break-words overflow-hidden text-ellipsis mb-1 italic"
                          key={index}
                        >
                          {file.name}
                        </p>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button
                disabled={isPending || isCompressing}
                className="w-full"
                type="submit"
              >
                Tạo album
              </Button>
            </form>
          </Form>
        </div>
        <div className="preview-album flex flex-col items-center justify-center gap-8">
          <h1 className="text-center text-2xl">Xem trước album</h1>
          <div
            className={`${styles.album} relative`}
            key={`album-${"album.id"}`}
          >
            {previewUrls.length > 0 ? (
              previewUrls.map((url, index) => (
                <>
                  <img
                    key={index}
                    src={url}
                    alt={selectedFiles[0]?.name || "Preview"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className={styles.overlay}>
                    <h3 className={styles.title}>{albumTitle}</h3>
                  </div>
                </>
              ))
            ) : (
              <p className="text-gray-600 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                {isCompressing ? (
                  <LineSpinerLoading />
                ) : (
                  "Chưa có ảnh để hiển thị"
                )}
              </p>
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

export default AddAlbumDialog;

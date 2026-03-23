import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import useControlVideo from "@/hooks/useControlVideo";
import { getThumbnailYoutubeVideoURL } from "@/pages/Portfolio/VideoPage/youtubeUtils";
import { useEffect, useState } from "react";

const AddVideoDialog = () => {
  const { form, isPending, onSubmit } = useControlVideo();
  const [isOpen, setIsOpen] = useState(false);

  const linkURL = form.watch("linkURL");
  const videoTitle = form.watch("videoTitle");
  const videoDescription = form.watch("videoDescription");
  const thumbnailUrl = getThumbnailYoutubeVideoURL(linkURL || "");

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };

  const handleSubmitAddVideo = async () => {
    await onSubmit();
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}
    >
      <DialogTrigger
        disabled={isPending}
        className="cursor-pointer inline-flex items-center justify-center p-2 md:p-3 border rounded-lg"
      >
        <i className="fa-regular fa-plus text-2xl md:text-3xl"></i>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[450px] md:w-fit md:!max-w-fit flex flex-col md:flex-row justify-between gap-6 md:gap-[80px] p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        <div className="add-box w-full md:w-[400px] flex flex-col gap-4 md:gap-8">
          <DialogTitle className="text-center text-lg md:text-xl">
            Add Video
          </DialogTitle>

          <DialogDescription className="sr-only">
            Fill in the form to add a new video. You can paste a YouTube URL and
            provide a title and description.
          </DialogDescription>

          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit(handleSubmitAddVideo)();
              }}
              className="space-y-4 md:space-y-8 flex flex-col"
            >
              <FormField
                control={form.control}
                name="linkURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL video</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập URL video YouTube" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tiêu đề video"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả video" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} className="w-full" type="submit">
                Thêm video
              </Button>
            </form>
          </Form>
        </div>

        {/* Preview */}
        <div className="preview-video hidden md:flex flex-col items-center justify-center gap-8">
          <h1 className="text-center text-xl md:text-2xl">Xem trước video</h1>
          <div className="w-[384px]">
            {thumbnailUrl ? (
              <img
                className="rounded-xl w-full h-auto aspect-video object-cover"
                src={thumbnailUrl}
                alt="Video thumbnail preview"
              />
            ) : (
              <div className="rounded-xl w-full aspect-video border border-dashed border-gray-500 flex items-center justify-center">
                <p className="text-gray-600">Chưa có URL để hiển thị</p>
              </div>
            )}
            <h3 className="font-semibold text-[16px] uppercase mt-3">
              {videoTitle || (
                <span className="text-gray-400 normal-case font-normal">
                  Tiêu đề video
                </span>
              )}
            </h3>
          </div>
          <div className="preview-description max-w-[384px]">
            <h3 className="text-center font-bold">Mô tả:</h3>
            <p className="w-[384px] overflow-hidden text-ellipsis text-center">
              {!videoDescription?.trim() ? (
                <span className="text-gray-600">(Chưa có mô tả)</span>
              ) : (
                videoDescription
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoDialog;

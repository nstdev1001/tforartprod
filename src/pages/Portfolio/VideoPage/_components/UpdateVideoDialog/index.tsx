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
import useControlVideo from "@/hooks/useControlVideo";
import { VideoData } from "@/types/videoDataType";
import { useEffect } from "react";

interface Props {
  videoData: VideoData | null;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateVideoDialog = ({ videoData, isOpen, onClose }: Props) => {
  const { form, isPending, editVideoMutation } = useControlVideo();

  useEffect(() => {
    if (isOpen && videoData) {
      form.setValue("linkURL", videoData.linkURL);
      form.setValue("videoTitle", videoData.videoTitle);
      form.setValue("videoDescription", videoData.videoDescription || "");
    }
  }, [videoData, form, isOpen]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!videoData) return;

    const formValues = form.getValues();
    const updatedData = {
      ...formValues,
      videoDescription: formValues.videoDescription || null,
    };

    editVideoMutation.mutate({
      videoId: videoData.id,
      updatedData,
    });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-fit !max-w-fit" aria-describedby={undefined}>
        <div className="add-box w-[400px] h-[400px]">
          <DialogTitle className="text-center text-2xl">
            Cập nhật video
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit(handleSubmit)();
              }}
              className="space-y-8 mt-5"
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
                Cập nhật video
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateVideoDialog;

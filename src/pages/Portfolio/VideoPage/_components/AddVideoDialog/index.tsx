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
import useControlVideo from "@/hooks/useControlVideo";
import { useEffect, useState } from "react";

const AddVideoDialog = () => {
  const { form, isPending, onSubmit } = useControlVideo();
  const [isOpen, setIsOpen] = useState(false);

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
        className="cursor-pointer hidden md:block p-3 border rounded-lg"
      >
        <i className="fa-regular fa-plus text-3xl"></i>
      </DialogTrigger>

      <DialogContent className="w-fit !max-w-fit" aria-describedby={undefined}>
        <div className="add-box w-[400px] h-[400px]">
          <DialogTitle className="text-center text-xl">Add Video</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit(handleSubmitAddVideo)();
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
                Thêm video
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoDialog;

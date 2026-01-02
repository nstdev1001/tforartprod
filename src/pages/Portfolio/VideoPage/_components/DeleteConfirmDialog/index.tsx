import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VideoData } from "@/types/videoDataType";
import { UseMutateFunction } from "@tanstack/react-query";

interface Props {
  videoData: VideoData | null;
  isOpen: boolean;
  onClose: () => void;
  deleteVideoMutation: {
    mutate: UseMutateFunction<void, unknown, string, unknown>;
  };
}

const DeleteConfirmDialog = ({
  videoData,
  isOpen,
  onClose,
  deleteVideoMutation,
}: Props) => {
  const handleDeleteVideo = () => {
    if (!videoData) return;
    deleteVideoMutation.mutate(videoData.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="text-2xl text-center">
          Bạn chắc chắn muốn xóa video
          <span className="block italic text-red-500">
            {videoData?.videoTitle} ?
          </span>
        </DialogTitle>
        <p id="delete-video-description" className="sr-only">
          Confirm delete video
        </p>
        <div className="flex justify-center gap-3">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteVideo}
          >
            Có
          </Button>
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Khum
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;

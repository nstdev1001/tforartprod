import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlbumData } from "@/types/albumDataType";
import { UseMutateFunction } from "@tanstack/react-query";

interface Props {
  albumData: AlbumData | null;
  isOpen: boolean;
  onClose: () => void;
  deleteAlbumMutation: {
    mutate: UseMutateFunction<void, unknown, string, unknown>;
  };
}

const DeleteConfirmDialog = ({
  albumData,
  isOpen,
  onClose,
  deleteAlbumMutation,
}: Props) => {
  const handleDeleteAlbum = () => {
    if (!albumData) return;
    deleteAlbumMutation.mutate(albumData.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-w-[450px] p-4 md:p-6"
        aria-describedby={undefined}
      >
        <DialogTitle className="text-lg md:text-2xl text-center">
          Bạn chắc chắn muốn xóa album{" "}
          <span className="block italic text-red-500 text-base md:text-2xl mt-1">
            {albumData?.albumTitle} ?
          </span>
        </DialogTitle>
        <p id="delete-album-description" className="sr-only">
          Confirm delete album
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-2">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteAlbum}
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

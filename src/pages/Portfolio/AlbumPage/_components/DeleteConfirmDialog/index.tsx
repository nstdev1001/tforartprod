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
      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="text-2xl text-center">
          Bạn chắc chắn muốn xóa album{" "}
          <span className="block italic text-red-500">
            {albumData?.albumTitle} ?
          </span>
        </DialogTitle>
        <p id="delete-album-description" className="sr-only">
          Confirm delete album
        </p>
        <div className="flex justify-center gap-3">
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

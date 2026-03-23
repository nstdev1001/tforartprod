import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseMutateFunction } from "@tanstack/react-query";

interface Props {
  data: string[] | null;
  resetCheckedItems: () => void;
  allData: string[];
  isOpen: boolean;
  onClose: () => void;
  deleteMutation: {
    mutate: UseMutateFunction<void, unknown, string | string[], unknown>;
  };
}

const DeletePhotosConfirmDialog = ({
  data,
  isOpen,
  onClose,
  deleteMutation,
  resetCheckedItems,
  allData,
}: Props) => {
  const handleDelete = () => {
    if (data) {
      deleteMutation.mutate(data);
    }
    onClose();
    resetCheckedItems();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          <i className="fa-duotone fa-solid fa-triangle-exclamation"></i>{" "}
          Tforart nhắc nhở{" "}
          <i className="fa-duotone fa-solid fa-skull-crossbones"></i>
        </DialogTitle>
        <DialogDescription className="sr-only">
          Xác nhận xóa ảnh đã chọn.
        </DialogDescription>
        <div className="content-dialog text-center">
          Bạn chắc chắn muốn xóa{" "}
          <span className="text-red-500 font-bold">
            {data?.length === allData?.length
              ? "tất cả ảnh"
              : `${data?.length} ảnh`}
            ?
          </span>
        </div>
        <div className="flex justify-center gap-3">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
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

export default DeletePhotosConfirmDialog;

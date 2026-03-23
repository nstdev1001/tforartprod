import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseMutateFunction } from "@tanstack/react-query";
import { ReactNode } from "react";

interface Props {
  data: { id: string; title: string } | null;
  isOpen: boolean;
  onClose: () => void;
  deleteMutation: {
    mutate: UseMutateFunction<void, unknown, string, unknown>;
  };
  dialogTitle?: ReactNode;
}

const DeleteConfirmDialog = ({
  data,
  isOpen,
  onClose,
  deleteMutation,
  dialogTitle,
}: Props) => {
  const handleDelete = () => {
    if (data) {
      deleteMutation.mutate(data.id);
    }
    onClose();
  };

  const defaultDialogTitle = (
    <>
      <i className="fa-duotone fa-solid fa-triangle-exclamation"></i> Bạn chắc
      chắn muốn xóa?
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-2xl text-center">
          <i className="fa-duotone fa-solid fa-triangle-exclamation"></i>{" "}
          Tforart nhắc nhở{" "}
          <i className="fa-duotone fa-solid fa-skull-crossbones"></i>
        </DialogTitle>
        <DialogDescription className="sr-only">
          Xác nhận xóa mục đã chọn.
        </DialogDescription>
        <div className="content-dialog text-center">
          {data ? (
            <>
              {dialogTitle}
              <p className="text-red-500 font-bold">{data?.title}?</p>
            </>
          ) : (
            defaultDialogTitle
          )}
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

export default DeleteConfirmDialog;

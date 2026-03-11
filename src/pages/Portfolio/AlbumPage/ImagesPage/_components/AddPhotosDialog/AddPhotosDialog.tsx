import useFirebaseImageUploader from "../../../useImageUploader";
import CompressImageLoading from "@/components/Loading/CompressImageLoading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useSelectImages } from "@/hooks/useSelectImages";
import { helix } from "ldrs";

helix.register();

const AddPhotosDialog = ({
  albumBucket,
  classNameButton,
}: {
  albumBucket: string;
  classNameButton?: string;
}) => {
  const {
    selectedFiles,
    handleDrop,
    handleDragOver,
    handleFileChange,
    setSelectedFiles,
    isCompressing,
  } = useSelectImages({ isThumbnail: false });

  const { uploadProgress, error, uploadImagesMutation, isOpen, setIsOpen } =
    useFirebaseImageUploader(albumBucket, setSelectedFiles);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant="default"
          onClick={() => setIsOpen(true)}
          className={classNameButton}
        >
          <i className="fa-solid fa-cloud-arrow-up"></i> Upload photos
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] p-4 md:p-6">
        <div className="add-box w-full flex flex-col gap-5 md:gap-7">
          <h1 className="text-center text-xl md:text-2xl">Upload photos to your album</h1>
          <div
            className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 md:p-6 border-2 border-dashed border-gray-500 rounded-lg"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="w-full md:w-[210px] h-[150px] flex flex-col gap-4 items-center relative">
              {isCompressing ? (
                <div className="w-full absolute flex flex-col items-center gap-3 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <CompressImageLoading />
                  <p>Đang nén ảnh...</p>
                </div>
              ) : (
                <>
                  <p className="text-lg text-gray-600 text-center w-52">
                    Drag and drop your files here to upload
                  </p>
                  <span className="text-gray-500 text-sm">- or -</span>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition"
                  >
                    Browse Files
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </>
              )}
            </div>
            {selectedFiles.length === 0 ? (
              <div className="text-gray-600 text-center mt-4">
                No photos selected
              </div>
            ) : (
              <div className="mt-4 w-full">
                <h4 className="text-gray-700 font-medium">
                  Đã chọn {selectedFiles.length} ảnh
                </h4>
              </div>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            onClick={() => uploadImagesMutation.mutate(selectedFiles)}
            disabled={selectedFiles.length === 0 || isCompressing}
          >
            {isCompressing ? "Compressing images..." : "Upload photos"}
          </Button>
          {uploadProgress > 0 && <Progress value={uploadProgress} />}
          <div className="flex flex-col justify-center items-center">
            <p className="text-gray-600 text-sm text-center">
              {uploadProgress > 0 &&
                `Uploading photos: ${uploadProgress.toFixed(2)}%`}
            </p>
            {error && <p className="text-red-500">Lỗi: {error}</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotosDialog;

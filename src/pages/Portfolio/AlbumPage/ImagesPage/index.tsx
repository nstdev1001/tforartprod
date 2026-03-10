import AddPhotosDialog from "./_components/AddPhotosDialog/AddPhotosDialog";
import DeletePhotosConfirmDialog from "./_components/DeletePhotosConfirmDialog/DeleteConfirmDialog";
import FormUpdateAlbumInfo from "./_components/FormUpdateAlbumInfo/FormUpdateAlbumInfo";
import NoData from "@/components/NoData/NoData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import useControlAlbum from "@/hooks/useControlAlbum";
import { useFullScreenGallery } from "@/hooks/useFullScreenGallery";
import useImageUploader from "@/pages/Portfolio/AlbumPage/useImageUploader";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface HandleCheckboxChange {
  (value: string): void;
}

const ImagePage = () => {
  const { checkIsLogin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { albums, editAlbumMutation, form } = useControlAlbum();
  const { photos, deletePhotoMutation } = useImageUploader(id || "");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [editAlbumInfo, setEditAlbumInfo] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const albumInfo = albums?.find((data) => data.id === id);
  const skeletonCount = 5;

  const {
    currentImageIndex,
    openFullScreen,
    closeFullScreen,
    goToNext,
    goToPrevious,
  } = useFullScreenGallery(photos || []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (albumInfo) {
      form.setValue("albumTitle", albumInfo.albumTitle);
      form.setValue("albumDescription", albumInfo.albumDescription || "");
    }
  }, [albumInfo, form]);

  const handleUpdateAlbumInfo = () => {
    setEditAlbumInfo(true);
    if (albumInfo) {
      const updatedData = form.getValues();

      editAlbumMutation.mutate({
        albumId: albumInfo.id,
        updatedData,
        oldThumbnailUrl: albumInfo.thumbnailUrl,
      });
    }
    setEditAlbumInfo(false);
  };

  const handleCheckboxChange: HandleCheckboxChange = (value) => {
    setCheckedItems((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAllChecked) {
      setCheckedItems([]);
    } else {
      setCheckedItems(photos || []);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  return (
    <Fragment>
      <Button
        variant={"outline"}
        className="w-[100px]"
        onClick={() => navigate(-1)}
      >
        <i className="fa-solid fa-arrow-left-long"></i> Back
      </Button>
      <div className="title-wrapper flex flex-col items-center gap-3">
        {!albums ? (
          <>
            <Skeleton className="w-[400px] h-10 mx-auto" />
            <Skeleton className="w-[200px] h-5 mx-auto mt-3" />
          </>
        ) : (
          <>
            {editAlbumInfo ? (
              <FormUpdateAlbumInfo
                form={form}
                onSubmit={handleUpdateAlbumInfo}
                onCancel={() => setEditAlbumInfo(false)}
              />
            ) : (
              <div className="flex flex-col items-center gap-5">
                <h2
                  className="text-4xl font-semibold max-w-[600px] text-center break-words"
                  onClick={() => checkIsLogin && setEditAlbumInfo(true)}
                >
                  {albumInfo?.albumTitle}
                </h2>
                <p
                  className="max-w-[300px] md:max-w-[500px] lg:max-w-[450px] text-center break-words"
                  onClick={() => checkIsLogin && setEditAlbumInfo(true)}
                >
                  {albumInfo?.albumDescription}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {photos && photos.length === 0 ? (
        <div className="flex flex-col items-center gap-20 mt-10">
          <NoData />
          {checkIsLogin && (
            <AddPhotosDialog
              albumBucket={id || ""}
              classNameButton="w-[300px] scale-150"
            />
          )}
        </div>
      ) : (
        <div className="image-container">
          {checkIsLogin && (
            <div className="hidden control-button md:flex justify-between items-center">
              <DeletePhotosConfirmDialog
                resetCheckedItems={() => setCheckedItems([])}
                allData={photos || []}
                data={checkedItems}
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                deleteMutation={deletePhotoMutation}
              />
              <AddPhotosDialog albumBucket={id || ""} />
              <div className="flex gap-3 justify-center">
                <div className="flex items-center space-x-2 border px-3 rounded-md">
                  <Checkbox
                    disabled={photos?.length === 0}
                    id="selectAll"
                    checked={selectAllChecked}
                    onCheckedChange={handleSelectAllChange}
                  />
                  <label htmlFor="selectAll" className="cursor-pointer">
                    {selectAllChecked ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </label>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={checkedItems.length === 0}
                >
                  <i className="fa-regular fa-trash-can"></i> Delete more
                </Button>
              </div>
            </div>
          )}

          <div className="columns-1 sm:columns-2 lg:columns-3 py-10 md:py-20 gap-4">
            {!photos
              ? Array.from({ length: skeletonCount }).map((_, index) => (
                  <div className="mb-4 break-inside-avoid" key={index}>
                    <Skeleton className="w-full h-64 rounded-lg" />
                  </div>
                ))
              : photos.map((photo, index) => (
                  <div
                    className="mb-4 break-inside-avoid relative"
                    key={`image ${index}`}
                  >
                    {checkIsLogin && (
                      <>
                        <Checkbox
                          checked={checkedItems.includes(photo)}
                          onCheckedChange={() => handleCheckboxChange(photo)}
                          className="hidden md:block absolute top-3 left-3 border-white bg-black/50"
                        />
                        <Button
                          variant="destructive"
                          className="hidden md:block absolute top-3 right-3"
                          onClick={() => deletePhotoMutation.mutate(photo)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </>
                    )}

                    <img
                      src={photo}
                      alt=""
                      className="w-[500px] object-cover rounded-lg cursor-pointer"
                      onClick={() => openFullScreen(index)}
                    />
                  </div>
                ))}
          </div>

          {currentImageIndex !== null && photos && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
              <Button
                variant="ghost"
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                onClick={closeFullScreen}
              >
                <i className="fa-solid fa-xmark text-2xl"></i>
              </Button>

              {/* Container cho ảnh và checkbox */}
              <div className="relative inline-block">
                <img
                  src={photos[currentImageIndex]}
                  alt={`image ${currentImageIndex + 1}`}
                  className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                />
                {checkIsLogin && (
                  <Checkbox
                    checked={checkedItems.includes(photos[currentImageIndex])}
                    onCheckedChange={() =>
                      handleCheckboxChange(photos[currentImageIndex])
                    }
                    className="absolute top-3 left-3 z-50 w-5 h-5 border-white bg-black/50"
                  />
                )}
              </div>
              <Button
                variant="ghost"
                className="w-10 h-10 absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 rounded-full"
                onClick={goToPrevious}
                disabled={currentImageIndex === 0}
              >
                <i className="fa-solid fa-chevron-left text-3xl"></i>
              </Button>
              <Button
                variant="ghost"
                className="w-10 h-10 absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 rounded-full"
                onClick={goToNext}
                disabled={currentImageIndex === photos.length - 1}
              >
                <i className="fa-solid fa-chevron-right text-3xl"></i>
              </Button>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ImagePage;

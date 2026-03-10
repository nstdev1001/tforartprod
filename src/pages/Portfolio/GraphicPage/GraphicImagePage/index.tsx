import AddPhotosDialog from "./_components/AddPhotosDialog/AddPhotosDialog";
import CustomGapSelector from "./_components/CustomGapSelector/CustomGapSelector";
import DeletePhotosConfirmDialog from "./_components/DeletePhotosConfirmDialog/DeleteConfirmDialog";
import NoData from "@/components/NoData/NoData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import useAuth from "@/hooks/useAuth";
import useControlGraphicProject from "@/hooks/useControlGraphicProject";
import { useFullScreenGallery } from "@/hooks/useFullScreenGallery";
import FormUpdateProjectInfo from "@/pages/Portfolio/GraphicPage/GraphicImagePage/_components/FormUpdateAlbumInfo/FormUpdateProjectInfo";
import useGraphicUploader from "@/pages/Portfolio/GraphicPage/useGraphicUploader";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface HandleCheckboxChange {
  (value: string): void;
}

const GraphicImagePage = () => {
  const { checkIsLogin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { projects, editProjectMutation, form } = useControlGraphicProject();
  const { photos, deletePhotoMutation } = useGraphicUploader(id || "");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [editprojectInfo, setEditprojectInfo] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRoundedImage, setIsRoundedImage] = useState(true);
  const [selectedGap, setSelectedGap] = useState<string>("mb-4");
  const projectInfo = projects?.find((data) => data.id === id);

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
    if (projectInfo) {
      form.setValue("projectTitle", projectInfo.projectTitle);
      form.setValue("projectDescription", projectInfo.projectDescription || "");
    }
  }, [projectInfo, form]);

  const handleUpdateprojectInfo = () => {
    setEditprojectInfo(true);
    if (projectInfo) {
      const updatedData = form.getValues();

      editProjectMutation.mutate({
        ...projectInfo,
        projectId: projectInfo.id,
        oldThumbnailUrl: projectInfo.thumbnailUrl,
        updatedData,
      });
    }
    setEditprojectInfo(false);
  };

  const handleRoundedImage = () => {
    setIsRoundedImage((prev) => {
      const newValue = !prev;

      if (projectInfo) {
        editProjectMutation.mutate({
          ...projectInfo,
          projectId: projectInfo.id,
          updatedData: form.getValues(),
          oldThumbnailUrl: projectInfo.thumbnailUrl,
          isRoundedImage: newValue,
        });
      }

      return newValue;
    });
  };

  const handleSelectGap = (gap: string) => {
    setSelectedGap(gap);
    if (projectInfo) {
      editProjectMutation.mutate({
        ...projectInfo,
        projectId: projectInfo.id,
        updatedData: form.getValues(),
        oldThumbnailUrl: projectInfo.thumbnailUrl,
        gapImage: gap,
      });
    }
  };

  useEffect(() => {
    if (projectInfo) {
      setIsRoundedImage(projectInfo.isRoundedImage || false);
    }
  }, [projectInfo]);

  useEffect(() => {
    if (projectInfo) {
      setSelectedGap(projectInfo.gapImage || "");
    }
  }, [projectInfo]);

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

  const skeletonCount = 5;

  return (
    <Fragment>
      <Button
        variant={"outline"}
        className="w-[100px]"
        onClick={() => navigate(-1)}
      >
        <i className="fa-solid fa-arrow-left-long"></i> Quay lại
      </Button>
      <div className="title-wrapper flex flex-col items-center gap-3">
        {!projects ? (
          <>
            <Skeleton className="w-[400px] h-10 mx-auto" />
            <Skeleton className="w-[200px] h-5 mx-auto mt-3" />
          </>
        ) : (
          <>
            {editprojectInfo ? (
              <FormUpdateProjectInfo
                form={form}
                onSubmit={handleUpdateprojectInfo}
                onCancel={() => setEditprojectInfo(false)}
              />
            ) : (
              <div className="flex flex-col items-center gap-5">
                <h2
                  className="text-4xl font-semibold max-w-[600px] text-center break-words"
                  onClick={() => checkIsLogin && setEditprojectInfo(true)}
                >
                  {projectInfo?.projectTitle}
                </h2>
                <p
                  className="max-w-[300px] md:max-w-[500px] lg:max-w-[450px] text-center break-words"
                  onClick={() => checkIsLogin && setEditprojectInfo(true)}
                >
                  {projectInfo?.projectDescription}
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
        <>
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
                  <i className="fa-regular fa-trash-can"></i> Xóa nhiều ảnh
                </Button>
              </div>
            </div>
          )}
          <div className="image_container py-10 md:py-20">
            {checkIsLogin && (
              <div className="control_grid_button flex gap-6 justify-center items-center mb-5">
                <div className="border_button flex items-center gap-2">
                  <Label htmlFor="border-radius">Bo góc</Label>
                  {projectInfo && (
                    <Switch
                      id="border-radius"
                      checked={isRoundedImage}
                      onCheckedChange={handleRoundedImage}
                    />
                  )}
                </div>
                <div className="gap_button flex items-center gap-2">
                  <Label htmlFor="gap">Khoảng cách</Label>
                  <CustomGapSelector
                    gap={selectedGap}
                    onChange={(value) => handleSelectGap(value)}
                  />
                </div>
              </div>
            )}

            {!photos
              ? Array.from({ length: skeletonCount }).map((_, index) => (
                  <div className="mb-4 mt-5 break-inside-avoid" key={index}>
                    <Skeleton className="w-full h-64 rounded-lg" />
                  </div>
                ))
              : photos.map((photo, index) => (
                  <div className="relative" key={`image ${index}`}>
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
                      alt="image"
                      className={`w-full object-cover ${
                        projectInfo?.isRoundedImage && "rounded-lg"
                      } ${projectInfo?.gapImage} cursor-pointer`}
                      onClick={() => openFullScreen(index)}
                    />
                  </div>
                ))}
          </div>
          <div className="flex justify-center">
            {checkIsLogin && (
              <AddPhotosDialog
                albumBucket={id || ""}
                classNameButton="w-[300px] scale-150"
              />
            )}
          </div>
        </>
      )}

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
    </Fragment>
  );
};

export default GraphicImagePage;

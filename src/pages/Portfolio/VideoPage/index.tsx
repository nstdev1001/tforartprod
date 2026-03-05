import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { createSmoothTextContainerMotionProps } from "@/config/motion_config";
import useAuth from "@/hooks/useAuth";
import useControlVideo from "@/hooks/useControlVideo";
import AddVideoDialog from "@/pages/Portfolio/VideoPage/_components/AddVideoDialog";
import UpdateVideoDialog from "@/pages/Portfolio/VideoPage/_components/UpdateVideoDialog";
import VideoDialog from "@/pages/Portfolio/VideoPage/_components/VideoDialog";
import {
  getEmbedYoutubeVideoURL,
  getThumbnailYoutubeVideoURL,
} from "@/pages/Portfolio/VideoPage/youtubeUtils";
import { VideoData } from "@/types/videoDataType";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import styles from "./style.module.css";

interface SortableVideoProps {
  video: VideoData;
  checkIsLogin: boolean;
  handleEditClick: (video: VideoData) => void;
  handleDeleteClick: (video: VideoData) => void;
  deleteVideoMutation: {
    mutate: (id: string) => void;
    isPending: boolean;
  };
}

interface DragVideoPreviewProps {
  video: VideoData;
}

const SortableVideo = ({
  video,
  checkIsLogin,
  handleEditClick,
  handleDeleteClick,
}: SortableVideoProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <Dialog>
      <div
        className={`${styles.videoWrapper} relative ${
          isDragging ? `${styles.dragging}` : ""
        } ${checkIsLogin ? "min-h-[350px]" : ""}`}
        ref={setNodeRef}
        style={style}
      >
        {checkIsLogin && (
          <>
            <div className="control-btn flex justify-center items-center gap-5 absolute bottom-[20px] left-[50%] -translate-x-[50%]">
              <Button
                variant="outline"
                className="w-[50px]"
                {...attributes}
                {...listeners}
              >
                <i className="fa-solid fa-grip-lines"></i>
              </Button>
              <Button
                variant="secondary"
                className="w-[50px]"
                onClick={() => handleEditClick(video)}
              >
                <i className="fa-duotone fa-thin fa-pen-to-square"></i>
              </Button>
              <Button
                variant="destructive"
                className="w-[50px]"
                onClick={() => handleDeleteClick(video)}
              >
                <i className="fa-light fa-trash"></i>
              </Button>
            </div>
          </>
        )}

        <DialogTrigger className="text-start">
          <img
            className="rounded-xl w-full h-auto aspect-video object-cover"
            src={getThumbnailYoutubeVideoURL(video.linkURL)}
            alt="thumbnail"
          />
        </DialogTrigger>

        <h3 className="font-semibold text-[16px] uppercase mt-3">
          {video.videoTitle}
        </h3>
      </div>
      <DialogContent className="w-fit max-w-fit">
        <VideoDialog
          src={getEmbedYoutubeVideoURL(video.linkURL)}
          title={video.videoTitle}
          description={video.videoDescription || ""}
        />
      </DialogContent>
    </Dialog>
  );
};

const DragVideoPreview = ({ video }: DragVideoPreviewProps) => {
  return (
    <div className={`${styles.videoWrapper} relative ${styles.previewDrag}`}>
      <img
        className="rounded-xl w-full h-auto aspect-video object-cover"
        src={getThumbnailYoutubeVideoURL(video.linkURL)}
        alt="thumbnail"
      />
      <div className="description mt-3">
        <h3 className="font-semibold text-[16px] uppercase">
          {video.videoTitle}
        </h3>
      </div>
    </div>
  );
};

const VideoPage = () => {
  const { videos, deleteVideoMutation, updateVideoPositionMutation } =
    useControlVideo();
  const { checkIsLogin } = useAuth();
  const [editVideoData, setEditVideoData] = useState<VideoData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderedVideos, setOrderedVideos] = useState<VideoData[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (videos) {
      setOrderedVideos([...videos]);
    }
  }, [videos]);

  const handleEditClick = (video: VideoData) => {
    setEditVideoData(video);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (video: VideoData) => {
    setEditVideoData(video);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditVideoData(null);
  };

  // Find active video for overlay
  const activeVideo = activeId
    ? orderedVideos.find((video) => video.id === activeId)
    : null;

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setOrderedVideos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        if (updateVideoPositionMutation) {
          const updatedPositions = newItems.map((video, index) => ({
            ...video,
            id: video.id,
            position: index,
          }));
          updateVideoPositionMutation.mutate(updatedPositions);
        }
        return newItems;
      });
    }
  };

  // Custom drop animation to show insertion point
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <Fragment>
      {checkIsLogin && <AddVideoDialog />}

      <DeleteConfirmDialog
        data={{
          id: editVideoData?.id || "",
          title: editVideoData?.videoTitle || "",
        }}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        deleteMutation={deleteVideoMutation}
        dialogTitle="Bạn có chắc chắn muốn xóa video"
      />

      <UpdateVideoDialog
        videoData={editVideoData}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <motion.div
          className={`video_page_container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ${
            checkIsLogin ? `${styles.sortableEnabled}` : ""
          }`}
          {...createSmoothTextContainerMotionProps(0.15)}
        >
          <SortableContext
            items={orderedVideos.map((video) => video.id)}
            strategy={rectSortingStrategy}
          >
            {orderedVideos.map((video) => (
              <SortableVideo
                key={video.id}
                video={video}
                checkIsLogin={checkIsLogin}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                deleteVideoMutation={{
                  mutate: deleteVideoMutation.mutate,
                  isPending: deleteVideoMutation.isPending,
                }}
              />
            ))}
          </SortableContext>
        </motion.div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && activeVideo ? (
            <DragVideoPreview video={activeVideo} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Fragment>
  );
};

export default VideoPage;

import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import useControlAlbum from "@/hooks/useControlAlbum";
import { AlbumData } from "@/types/albumDataType";
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
import { NavigateFunction, useNavigate } from "react-router-dom";
import AddAlbumDialog from "./_components/AddAlbumDialog";
import UpdateAlbumDialog from "./_components/UpdateAlbumDialog";
import styles from "./style.module.css";

interface SortableAlbumProps {
  album: AlbumData;
  checkIsLogin: boolean;
  handleEditClick: (album: AlbumData) => void;
  handleDeleteClick: (album: AlbumData) => void;
  toUrlSlug: (title: string) => string;
  navigate: NavigateFunction;
}

interface DragAlbumPreviewProps {
  album: AlbumData;
}

const SortableAlbum = ({
  album,
  checkIsLogin,
  handleEditClick,
  handleDeleteClick,
  toUrlSlug,
  navigate,
}: SortableAlbumProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: album.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      className={`${styles.album} relative ${
        isDragging ? `${styles.dragging}` : ""
      }`}
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        const target = e.target as Element;
        const isInteractiveElement =
          target.closest(".dragHandle") ||
          target.closest(".control-album") ||
          target.closest("button");

        if (!isInteractiveElement) {
          navigate(
            `/portfolio/photos/${album.id}/${toUrlSlug(album.albumTitle)}`,
          );
        }
      }}
    >
      {checkIsLogin && (
        <>
          <div className={styles.dragHandle} {...attributes} {...listeners}>
            <i className="fa-solid fa-grip-lines"></i>
          </div>
          <div
            className="control-album absolute top-1 right-1 z-10 flex gap-1 md:gap-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              className="h-8 w-8 md:h-9 md:w-auto md:px-4"
              onClick={() => handleEditClick(album)}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 w-8 md:h-9 md:w-auto md:px-4 md:ml-2"
              onClick={() => handleDeleteClick(album)}
            >
              <i className="fa-regular fa-trash-can"></i>
            </Button>
          </div>
        </>
      )}

      <img
        src={album.thumbnailUrl}
        alt={album.albumTitle}
        className="cursor-pointer"
      />
      <div className={`${styles.overlay} cursor-pointer`}>
        <h3 className={styles.title}>{album.albumTitle}</h3>
      </div>
    </div>
  );
};

const DragAlbumPreview = ({ album }: DragAlbumPreviewProps) => {
  return (
    <div className={`${styles.album} relative ${styles.previewDrag}`}>
      <img
        src={album.thumbnailUrl}
        alt={album.albumTitle}
        className="cursor-move"
      />
      <div className={styles.overlay}>
        <h3 className={styles.title}>{album.albumTitle}</h3>
      </div>
    </div>
  );
};

const AlbumPage = () => {
  const { checkIsLogin } = useAuth();
  const navigate = useNavigate();
  const {
    albums,
    toUrlSlug,
    deleteAlbumMutation,
    updateAlbumPositionMutation,
  } = useControlAlbum();
  const [editAlbumData, setEditAlbumData] = useState<AlbumData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderedAlbums, setOrderedAlbums] = useState<AlbumData[]>([]);
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
    if (albums) {
      setOrderedAlbums([...albums]);
    }
  }, [albums]);

  const handleEditClick = (album: AlbumData) => {
    setEditAlbumData(album);
    setIsEditDialogOpen(true);
  };
  const handleDeleteClick = (album: AlbumData) => {
    setEditAlbumData(album);
    setIsDeleteDialogOpen(true);
  };

  // Find active album for overlay
  const activeAlbum = activeId
    ? orderedAlbums.find((album) => album.id === activeId)
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
      setOrderedAlbums((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        if (updateAlbumPositionMutation) {
          const updatedPositions = newItems.map((album, index) => ({
            ...album,
            id: album.id,
            position: index,
          }));
          updateAlbumPositionMutation.mutate(updatedPositions);
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
      {checkIsLogin && <AddAlbumDialog />}

      <DeleteConfirmDialog
        data={{
          id: editAlbumData?.id || "",
          title: editAlbumData?.albumTitle || "",
        }}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        deleteMutation={deleteAlbumMutation}
        dialogTitle="Bạn có chắc chắn muốn xóa album"
      />

      <UpdateAlbumDialog
        albumData={editAlbumData}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <motion.div
          className={`album-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${
            checkIsLogin ? `${styles.sortableEnabled}` : ""
          }`}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
        >
          <SortableContext
            items={orderedAlbums.map((album) => album.id)}
            strategy={rectSortingStrategy}
          >
            {orderedAlbums.map((album) => (
              <SortableAlbum
                key={album.id}
                album={album}
                checkIsLogin={checkIsLogin}
                handleEditClick={() => handleEditClick(album)}
                handleDeleteClick={() => handleDeleteClick(album)}
                toUrlSlug={toUrlSlug}
                navigate={navigate}
              />
            ))}
          </SortableContext>
        </motion.div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && activeAlbum ? (
            <DragAlbumPreview album={activeAlbum} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Fragment>
  );
};

export default AlbumPage;

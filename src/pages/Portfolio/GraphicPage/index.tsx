import styles from "./style.module.css";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { defaultOpacityMotionProps } from "@/config/motion_config";
import useAuth from "@/hooks/useAuth";
import useControlGraphicProject from "@/hooks/useControlGraphicProject";
import AddProjectDialog from "@/pages/Portfolio/GraphicPage/_components/AddProjectDialog";
import UpdateProjectDialog from "@/pages/Portfolio/GraphicPage/_components/UpdateProjectDialog";
import { GraphicProjectData } from "@/types/graphicDataType";
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
import { UseMutateFunction } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface SortableProjectProps {
  project: GraphicProjectData;
  index: number;
  checkIsLogin: boolean;
  handleEditClick: (project: GraphicProjectData) => void;
  handleDeleteClick: (project: GraphicProjectData) => void;
  deleteProjectMutation: {
    mutate: UseMutateFunction<void, unknown, string, unknown>;
  };
  toUrlSlug: (title: string) => string;
  navigate: NavigateFunction;
}

interface DragProjectPreviewProps {
  project: GraphicProjectData;
}

const SortableProject = ({
  project,
  index,
  checkIsLogin,
  handleEditClick,
  handleDeleteClick,
  toUrlSlug,
  navigate,
}: SortableProjectProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <motion.div
      className={`${styles.project} relative ${
        isDragging ? `${styles.dragging}` : ""
      }`}
      ref={setNodeRef}
      style={style}
      {...defaultOpacityMotionProps}
      transition={{ duration: 1.5, delay: index * 0.2 }}
      onClick={(e) => {
        const target = e.target as Element;
        const isInteractiveElement =
          target.closest(".dragHandle") ||
          target.closest(".control-project") ||
          target.closest("button");

        if (!isInteractiveElement) {
          navigate(
            `/portfolio/graphics/${project.id}/${toUrlSlug(
              project.projectTitle
            )}`
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
            className="control-project absolute top-1 right-1 z-10 flex gap-1 md:gap-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              className="h-8 w-8 md:h-9 md:w-auto md:px-4"
              onClick={() => handleEditClick(project)}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 w-8 md:h-9 md:w-auto md:px-4 md:ml-2"
              onClick={() => handleDeleteClick(project)}
            >
              <i className="fa-regular fa-trash-can"></i>
            </Button>
          </div>
        </>
      )}

      <img
        src={project.thumbnailUrl}
        alt={project.projectTitle}
        className="cursor-pointer"
        onClick={() =>
          navigate(
            `/portfolio/graphics/${project.id}/${toUrlSlug(
              project.projectTitle
            )}`
          )
        }
      />
      <div
        className={`${styles.overlay} cursor-pointer`}
        onClick={() =>
          navigate(
            `/portfolio/graphics/${project.id}/${toUrlSlug(
              project.projectTitle
            )}`
          )
        }
      >
        <h3 className={styles.title}>{project.projectTitle}</h3>
      </div>
    </motion.div>
  );
};

const DragProjectPreview = ({ project }: DragProjectPreviewProps) => {
  return (
    <div className={`${styles.project} relative ${styles.previewDrag}`}>
      <img
        src={project.thumbnailUrl}
        alt={project.projectTitle}
        className="cursor-move"
      />
      <div className={styles.overlay}>
        <h3 className={styles.title}>{project.projectTitle}</h3>
      </div>
    </div>
  );
};

const GraphicPage = () => {
  const { checkIsLogin } = useAuth();
  const navigate = useNavigate();
  const {
    projects,
    toUrlSlug,
    deleteProjectMutation,
    updateProjectPositionMutation,
  } = useControlGraphicProject();
  const [editProjectData, setEditProjectData] =
    useState<GraphicProjectData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderedProjects, setOrderedProjects] = useState<GraphicProjectData[]>(
    []
  );
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
    })
  );

  useEffect(() => {
    if (projects) {
      setOrderedProjects([...projects]);
    }
  }, [projects]);

  const handleEditClick = (project: GraphicProjectData) => {
    setEditProjectData(project);
    setIsEditDialogOpen(true);
  };
  const handleDeleteClick = (project: GraphicProjectData) => {
    setEditProjectData(project);
    setIsDeleteDialogOpen(true);
  };

  // Find active project for overlay
  const activeProject = activeId
    ? orderedProjects.find((project) => project.id === activeId)
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
      setOrderedProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        if (updateProjectPositionMutation) {
          const updatedPositions = newItems.map((project, index) => ({
            ...project,
            id: project.id,
            position: index,
          }));
          updateProjectPositionMutation.mutate(updatedPositions);
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
      {checkIsLogin && <AddProjectDialog />}

      <DeleteConfirmDialog
        data={{
          id: editProjectData?.id || "",
          title: editProjectData?.projectTitle || "",
        }}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        deleteMutation={deleteProjectMutation}
        dialogTitle="Bạn có chắc chắn muốn xóa project"
      />

      <UpdateProjectDialog
        projectData={editProjectData}
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
        <div
          className={`project-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${
            checkIsLogin ? `${styles.sortableEnabled}` : ""
          }`}
        >
          <SortableContext
            items={orderedProjects.map((project) => project.id)}
            strategy={rectSortingStrategy}
          >
            {orderedProjects.map((project, index) => (
              <SortableProject
                key={project.id}
                project={project}
                index={index}
                checkIsLogin={checkIsLogin}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                deleteProjectMutation={deleteProjectMutation}
                toUrlSlug={toUrlSlug}
                navigate={navigate}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && activeProject ? (
            <DragProjectPreview project={activeProject} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Fragment>
  );
};

export default GraphicPage;

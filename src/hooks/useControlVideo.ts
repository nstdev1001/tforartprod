/* eslint-disable @typescript-eslint/no-unused-vars */
import { videoSchema } from "@/schema/videoSchema";
import { VideoData } from "@/types/videoDataType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import NProgress from "nprogress";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const useControlVideo = () => {
  const db = getFirestore();
  const queryClient = useQueryClient();

  const { data: videos, isPending } = useQuery<VideoData[]>({
    queryKey: ["videoCollection"],
    queryFn: async () => {
      const q = query(
        collection(db, "videoCollection"),
        orderBy("position", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        position: (doc.data() as VideoData).position || Number.MIN_SAFE_INTEGER,
      })) as VideoData[];
    },
  });

  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      linkURL: "",
      videoTitle: "",
      videoDescription: "",
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async () => {
      NProgress.start();
      const formValues = form.getValues();

      // Find the minimum position (could be negative)
      let minPosition = 0;
      if (videos && videos.length > 0) {
        minPosition = Math.min(...videos.map((video) => video.position || 0));
      }

      return await addDoc(collection(db, "videoCollection"), {
        ...formValues,
        videoDescription: formValues.videoDescription || null,
        position: minPosition - 1, // Use a value lower than the current minimum
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["videoCollection"] });
      NProgress.done();
      form.reset();
    },
    onError: (error) => {
      NProgress.done();
      toast.error("Thêm video thất bại!");
      console.error(error);
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      if (!videoId) return;

      NProgress.start();
      return deleteDoc(doc(db, "videoCollection", videoId));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["videoCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      NProgress.done();
      toast.error("Xóa video thất bại! Vui lòng thử lại.");
      console.error(error);
    },
  });

  const editVideoMutation = useMutation({
    mutationFn: async ({
      videoId,
      updatedData,
    }: {
      videoId: string;
      updatedData: Partial<VideoData>;
    }) => {
      if (!videoId) return;

      NProgress.start();
      const videoRef = doc(db, "videoCollection", videoId);
      const { createdAt, ...dataToUpdate } = updatedData;
      return updateDoc(videoRef, dataToUpdate);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["videoCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      NProgress.done();
      toast.error("Cập nhật video thất bại! Vui lòng thử lại.");
      console.error(error);
    },
  });

  const updateVideoPositionMutation = useMutation({
    mutationFn: async (position: VideoData[]) => {
      NProgress.start();
      const batch = writeBatch(db);

      position.forEach((item) => {
        const videoRef = doc(db, "videoCollection", item.id);
        batch.update(videoRef, { position: item.position });
      });
      return batch.commit();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["videoCollection"] });
      NProgress.done();
    },
    onError: (error) => {
      NProgress.done();
      toast.error("Failed to update album !");
      console.error(error);
    },
  });

  const onSubmit = async () => {
    await form.handleSubmit(() => {
      addVideoMutation.mutate();
    })();
  };

  return {
    form,
    onSubmit,
    isPending,
    videos,
    deleteVideoMutation,
    editVideoMutation,
    updateVideoPositionMutation,
  };
};

export default useControlVideo;

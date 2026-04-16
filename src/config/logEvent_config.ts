import { app } from "@/services/firebaseConfig";

type AnalyticsModule = typeof import("firebase/analytics");
type AnalyticsInstance = ReturnType<AnalyticsModule["getAnalytics"]>;

type PageViewPayload = {
  pathname: string;
  pageTitle?: string;
};

type AlbumViewPayload = {
  albumId: string;
  albumTitle?: string;
  albumSlug?: string;
};

type VideoViewPayload = {
  videoId: string;
  videoTitle?: string;
  videoUrl?: string;
};

const analyticsState = {
  instance: null as AnalyticsInstance | null,
  module: null as AnalyticsModule | null,
  initialized: false,
};

const canUseAnalytics = () => {
  const isEnabledByEnv = import.meta.env.VITE_ENABLE_ANALYTICS === "true";
  const isProduction = import.meta.env.PROD;

  return (
    typeof window !== "undefined" &&
    (isProduction || isEnabledByEnv) &&
    !!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  );
};

const getAnalyticsInstance = async () => {
  if (!canUseAnalytics()) {
    return null;
  }

  if (analyticsState.initialized) {
    return analyticsState.instance;
  }

  analyticsState.initialized = true;

  try {
    analyticsState.module = await import("firebase/analytics");
    const supported = await analyticsState.module.isSupported();
    if (!supported) {
      return null;
    }

    analyticsState.instance = analyticsState.module.getAnalytics(app);
    return analyticsState.instance;
  } catch {
    return null;
  }
};

const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

export const analyticsEvents = {
  pageView: "page_view",
  albumView: "view_album",
  videoView: "view_video",
} as const;

export const trackPageView = async ({
  pathname,
  pageTitle,
}: PageViewPayload) => {
  const analytics = await getAnalyticsInstance();
  if (!analytics) {
    return;
  }

  const analyticsModule = analyticsState.module;
  if (!analyticsModule) {
    return;
  }

  const pagePath = normalizePathname(pathname);

  analyticsModule.logEvent(analytics, analyticsEvents.pageView, {
    page_path: pagePath,
    page_title: pageTitle || pagePath,
  });
};

export const trackAlbumView = async ({
  albumId,
  albumTitle,
  albumSlug,
}: AlbumViewPayload) => {
  const analytics = await getAnalyticsInstance();
  if (!analytics) {
    return;
  }

  const analyticsModule = analyticsState.module;
  if (!analyticsModule) {
    return;
  }

  analyticsModule.logEvent(analytics, analyticsEvents.albumView, {
    album_id: albumId,
    album_title: albumTitle || "unknown_album",
    album_slug: albumSlug || "",
  });
};

export const trackVideoView = async ({
  videoId,
  videoTitle,
  videoUrl,
}: VideoViewPayload) => {
  const analytics = await getAnalyticsInstance();
  if (!analytics) {
    return;
  }

  const analyticsModule = analyticsState.module;
  if (!analyticsModule) {
    return;
  }

  analyticsModule.logEvent(analytics, analyticsEvents.videoView, {
    video_id: videoId,
    video_title: videoTitle || "unknown_video",
    video_url: videoUrl || "",
  });
};

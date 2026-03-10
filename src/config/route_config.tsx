import Layout from "@/components/Layout/Layout";
import NotFound from "@/components/NotFound/NotFound";
import Home from "@/pages/Home";
import { createBrowserRouter, Navigate } from "react-router-dom";

const lazyPage = (
  importFn: () => Promise<{ default: React.ComponentType }>,
) => ({
  lazy: () => importFn().then((m) => ({ Component: m.default })),
});

export const routerConfig = createBrowserRouter(
  [
    {
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          ...lazyPage(() => import("@/pages/Login")),
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/about-us",
          ...lazyPage(() => import("@/pages/AboutUs")),
        },
        {
          path: "/portfolio",
          ...lazyPage(() => import("@/pages/Portfolio")),
          children: [
            {
              index: true,
              element: <Navigate to="videos" replace />,
            },
            {
              path: "videos",
              ...lazyPage(() => import("@/pages/Portfolio/VideoPage")),
            },
            {
              path: "photos",
              ...lazyPage(() => import("@/pages/Portfolio/AlbumPage")),
            },
            {
              path: "photos/:id/:albumSlug",
              ...lazyPage(
                () => import("@/pages/Portfolio/AlbumPage/ImagesPage"),
              ),
            },
            {
              path: "graphics",
              ...lazyPage(() => import("@/pages/Portfolio/GraphicPage")),
            },
            {
              path: "graphics/:id/:albumSlug",
              ...lazyPage(
                () => import("@/pages/Portfolio/GraphicPage/GraphicImagePage"),
              ),
            },
          ],
        },
        {
          path: "/services",
          ...lazyPage(() => import("@/pages/CompanyServices")),
        },
        {
          path: "/contact",
          ...lazyPage(() => import("@/pages/Contact")),
        },
        {
          path: "/company-info",
          ...lazyPage(() => import("@/pages/CompanyInfo")),
        },
        {
          path: "/privacy-policy",
          ...lazyPage(() => import("@/pages/PrivacyPolicy")),
        },
        {
          path: "/support/faq",
          ...lazyPage(() => import("@/pages/FAQ")),
        },
        {
          path: "/support/weather",
          ...lazyPage(() => import("@/pages/Weather")),
        },
        {
          path: "/support/gold-price",
          ...lazyPage(() => import("@/pages/GoldPrice")),
        },
        {
          path: "/developer-info",
          ...lazyPage(() => import("@/pages/DeveloperInfo")),
        },
        {
          path: "/ai-chatbot",
          ...lazyPage(() => import("@/pages/AIchatbot")),
        },
        {
          path: "/test-error",
          ...lazyPage(() => import("@/pages/TestError.index")),
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

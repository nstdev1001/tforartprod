import SuspenseWrapper from "@/components/Loading/SuspenseWrapper";
import NotFound from "@/components/NotFound/NotFound";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("@/pages/Login/Login"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const Portfolio = lazy(() => import("../pages/Portfolio/Portfolio"));
const VideoPage = lazy(() => import("@/pages/Portfolio/VideoPage"));
const AlbumPage = lazy(() => import("@/pages/Portfolio/AlbumPage"));
const ImagePage = lazy(() => import("@/pages/Portfolio/AlbumPage/ImagesPage"));
const GraphicPage = lazy(() => import("@/pages/Portfolio/GraphicPage"));
const GraphicImagePage = lazy(
  () => import("@/pages/Portfolio/GraphicPage/GraphicImagePage"),
);
const CompanyServices = lazy(() => import("@/pages/CompanyServices"));
const Contact = lazy(() => import("../pages/Contact"));
const CompanyInfo = lazy(() => import("@/pages/CompanyInfo"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TforartFAQ = lazy(() => import("@/pages/FAQ"));
const WeatherApp = lazy(() => import("@/pages/Weather"));
const DeveloperInfoPage = lazy(() => import("@/pages/DeveloperInfo"));
const AIchatbot = lazy(() => import("@/pages/AIchatbot"));
const GoldPrice = lazy(() => import("@/pages/GoldPrice"));
const TestError = lazy(() => import("@/pages/TestError"));

const S = SuspenseWrapper;

export const routerConfig = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <S>
          <Home />
        </S>
      ),
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      element: (
        <S>
          <Login />
        </S>
      ),
    },
    {
      path: "/home",
      element: (
        <S>
          <Home />
        </S>
      ),
    },
    {
      path: "/about-us",
      element: (
        <S>
          <AboutUs />
        </S>
      ),
    },
    {
      path: "/portfolio",
      element: (
        <S>
          <Portfolio />
        </S>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="videos" replace />,
        },
        {
          path: "videos",
          element: (
            <S>
              <VideoPage />
            </S>
          ),
        },
        {
          path: "photos",
          element: (
            <S>
              <AlbumPage />
            </S>
          ),
        },
        {
          path: "photos/:id/:albumSlug",
          element: (
            <S>
              <ImagePage />
            </S>
          ),
        },
        {
          path: "graphics",
          element: (
            <S>
              <GraphicPage />
            </S>
          ),
        },
        {
          path: "graphics/:id/:albumSlug",
          element: (
            <S>
              <GraphicImagePage />
            </S>
          ),
        },
      ],
    },
    {
      path: "/services",
      element: (
        <S>
          <CompanyServices />
        </S>
      ),
    },
    {
      path: "/contact",
      element: (
        <S>
          <Contact />
        </S>
      ),
    },
    {
      path: "/company-info",
      element: (
        <S>
          <CompanyInfo />
        </S>
      ),
    },
    {
      path: "/privacy-policy",
      element: (
        <S>
          <PrivacyPolicy />
        </S>
      ),
    },
    {
      path: "/support/faq",
      element: (
        <S>
          <TforartFAQ />
        </S>
      ),
    },
    {
      path: "/support/weather",
      element: (
        <S>
          <WeatherApp />
        </S>
      ),
    },
    {
      path: "/support/gold-price",
      element: (
        <S>
          <GoldPrice />
        </S>
      ),
    },
    {
      path: "/developer-info",
      element: (
        <S>
          <DeveloperInfoPage />
        </S>
      ),
    },
    {
      path: "/ai-chatbot",
      element: (
        <S>
          <AIchatbot />
        </S>
      ),
    },
    {
      path: "/test-error",
      element: (
        <S>
          <TestError />
        </S>
      ),
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

import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import Portfolio from "../pages/Portfolio/Portfolio";
import NotFound from "@/components/NotFound/NotFound";
import AIchatbot from "@/pages/AIchatbot";
import CompanyInfo from "@/pages/CompanyInfo";
import CompanyServices from "@/pages/CompanyServices";
import DeveloperInfoPage from "@/pages/DeveloperInfo";
import TforartFAQ from "@/pages/FAQ";
import Login from "@/pages/Login/Login";
import AlbumPage from "@/pages/Portfolio/AlbumPage";
import ImagePage from "@/pages/Portfolio/AlbumPage/ImagesPage";
import GraphicPage from "@/pages/Portfolio/GraphicPage";
import GraphicImagePage from "@/pages/Portfolio/GraphicPage/GraphicImagePage";
import VideoPage from "@/pages/Portfolio/VideoPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TestError from "@/pages/TestError";
import WeatherApp from "@/pages/Weather";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const routerConfig = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/about-us",
      element: <AboutUs />,
    },
    {
      path: "/portfolio",
      element: <Portfolio />,
      children: [
        {
          index: true,
          element: <Navigate to="videos" replace />,
        },
        {
          path: "videos",
          element: <VideoPage />,
        },
        {
          path: "photos",
          element: <AlbumPage />,
        },
        {
          path: "photos/:id/:albumSlug",
          element: <ImagePage />,
        },
        {
          path: "graphics",
          element: <GraphicPage />,
        },
        {
          path: "graphics/:id/:albumSlug",
          element: <GraphicImagePage />,
        },
      ],
    },
    {
      path: "/services",
      element: <CompanyServices />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "/company-info",
      element: <CompanyInfo />,
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy />,
    },
    {
      path: "/support/faq",
      element: <TforartFAQ />,
    },
    {
      path: "/support/weather",
      element: <WeatherApp />,
    },
    {
      path: "/developer-info",
      element: <DeveloperInfoPage />,
    },
    {
      path: "/ai-chatbot",
      element: <AIchatbot />,
    },
    {
      path: "/test-error",
      element: <TestError />,
    },
  ],
  {
    future: {},
  }
);

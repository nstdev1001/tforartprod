import SEO from "@/components/SEO/SEO";
import LoadingBar from "@/config/loadingBar_config";
import { trackPageView } from "@/config/logEvent_config";
import { getRouteMetaByPath } from "@/config/routeMeta";
import { Fragment, useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const Layout = () => {
  const location = useLocation();
  const routeMeta = getRouteMetaByPath(location.pathname);
  const lastTrackedPathRef = useRef<string>("");

  useEffect(() => {
    const pathname = location.pathname;

    if (lastTrackedPathRef.current === pathname) {
      return;
    }

    lastTrackedPathRef.current = pathname;
    void trackPageView({
      pathname,
      pageTitle: routeMeta?.title,
    });
  }, [location.pathname, routeMeta?.title]);

  return (
    <Fragment>
      <SEO pathname={location.pathname} routeMeta={routeMeta} />
      <LoadingBar />
      <ScrollRestoration
        getKey={(location) => {
          const portfolioPaths = [
            "/portfolio/videos",
            "/portfolio/photos",
            "/portfolio/graphics",
          ];
          return portfolioPaths.includes(location.pathname)
            ? "/portfolio"
            : location.key;
        }}
      />
      <Navbar />
      <div className="w-full h-screen flex flex-col gap-[200px]">
        <div className="max-w-full">
          <Outlet />
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Layout;

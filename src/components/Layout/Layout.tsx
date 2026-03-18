import LoadingBar from "@/config/loadingBar_config";
import { buildDocumentTitle } from "@/config/routeMeta";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { Fragment, useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = buildDocumentTitle(location.pathname);
  }, [location.pathname]);

  return (
    <Fragment>
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

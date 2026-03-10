import LoadingBar from "@/config/loadingBar_config";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { Fragment } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

const Layout = () => {
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

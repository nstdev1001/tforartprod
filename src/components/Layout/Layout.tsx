import LoadingBar from "@/config/loadingBar_config";
import { Fragment, useRef } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const portfolioPaths = [
  "/portfolio/videos",
  "/portfolio/photos",
  "/portfolio/graphics",
];

const Layout = () => {
  const prevPathRef = useRef("");

  return (
    <Fragment>
      <LoadingBar />
      <ScrollRestoration
        getKey={(currentLocation) => {
          const isPortfolio = portfolioPaths.includes(currentLocation.pathname);
          const wasPortfolio = portfolioPaths.includes(prevPathRef.current);
          prevPathRef.current = currentLocation.pathname;

          return isPortfolio && wasPortfolio
            ? "/portfolio"
            : currentLocation.key;
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

import LoadingBar from "@/config/loadingBar_config";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { Fragment } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

const Layout = () => {
  return (
    <Fragment>
      <LoadingBar />
      <ScrollRestoration />
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

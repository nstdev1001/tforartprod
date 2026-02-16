import Layout from "../../components/Layout/Layout";
import AboutCompany from "./AboutCompany";
import Clients from "./Clients";
import Experience from "./Experience";
import HighlightProduct from "./HighlightProduct";
import styles from "./style.module.css";
import { defaultScaleMotionProps } from "@/config/motion_config";
import MoreProduct from "@/pages/Home/MoreProduct";
import { motion } from "framer-motion";
import { Fragment } from "react";

const Home = () => {
  const scrollToMainContent = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Fragment>
      <Layout>
        {/* hero */}
        <div className={`${styles.hero} w-full h-[800px] relative`}>
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/HERO.mp4"
            autoPlay
            muted
            loop
          />
          <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
            <motion.h1
              className="text-3xl text-center text-white"
              {...defaultScaleMotionProps}
              transition={{ duration: 3 }}
            >
              Welcome to the
            </motion.h1>
            <motion.img
              className="w-[400px] mt-3"
              src="/tforart_white.svg"
              alt="Logo"
              {...defaultScaleMotionProps}
              transition={{ duration: 3 }}
            />
            <button
              className={`${styles.heroButton} text-xl absolute left-[50%] transform -translate-x-1/2 w-[200px]`}
              onClick={scrollToMainContent}
            >
              Explore now
            </button>
          </div>
        </div>
        <div
          className="flex flex-col gap-[100px] lg:gap-[200px] max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[200px] mx-auto"
          id="main-content"
        >
          {/* brand */}
          <Clients />
          {/* about company */}
          <AboutCompany />
          {/* experience */}
          <Experience />
          {/* highlight */}
          <HighlightProduct />
          {/* more produtc */}
          <MoreProduct />
        </div>
      </Layout>
    </Fragment>
  );
};

export default Home;

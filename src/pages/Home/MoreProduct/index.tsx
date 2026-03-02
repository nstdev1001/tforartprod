import styles from "./style.module.css";
import { defaultYMotionProps } from "@/config/motion_config";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const MoreProduct = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className="more-product-container w-full flex flex-col gap-[50px] mx-auto">
        <motion.h3
          className={`${styles.productTitle} text-xl md:text-xl`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
        >
          Khám phá các sản phẩm khác
        </motion.h3>
        <div
          className={`${styles.typeProductWrapper} flex flex-col gap-[20px] w-full max-w-[600px] mx-auto`}
        >
          <motion.section
            className={styles.videography}
            onClick={() => navigate("/portfolio/videos")}
            {...defaultYMotionProps}
            transition={{ duration: 1 }}
          >
            <img src="/images/portfolio/videography.jpg" alt="" />
            <p className="text-md md:text-4xl">Videography</p>
          </motion.section>
          <motion.section
            className={styles.photography}
            onClick={() => navigate("/portfolio/photos")}
            {...defaultYMotionProps}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img src="/images/portfolio/photography.JPG" alt="" />
            <p className="text-md md:text-4xl">Photography</p>
          </motion.section>
          <motion.section
            className={styles.graphicDesign}
            onClick={() => navigate("/portfolio/graphics")}
            {...defaultYMotionProps}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img src="/images/portfolio/graphic.jpg" alt="" />
            <p className="text-md md:text-4xl">Graphic design</p>
          </motion.section>
        </div>
      </div>
    </Fragment>
  );
};

export default MoreProduct;

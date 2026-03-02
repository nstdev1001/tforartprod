import highlightProductsData from "./highlightProduct";
import styles from "./style.module.css";
import { defaultYMotionProps } from "@/config/motion_config";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { preconnect } from "react-dom";

const HighlightProduct = () => {
  preconnect("https://www.google.com");
  preconnect("https://static.doubleclick.net");
  return (
    <Fragment>
      <div className="hightlight-product-container flex flex-col gap-[50px] md:gap-[100px]">
        <motion.h3
          className={`${styles.productTitle} text-xl text-center uppercase font-semibold`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
        >
          Sản phẩm nổi bật
        </motion.h3>
        <div className="flex flex-col gap-[40px] md:gap-[80px] max-w-[1200px] mx-auto">
          {highlightProductsData.map((product) => (
            <Fragment key={product.id}>
              <div
                className={`product-wrapper flex flex-col md:flex-col lg:flex-row gap-[50px] md:gap-[50px] lg:gap-[100px] items-center justify-center ${
                  product.reverseLayout ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* pc */}
                <motion.div
                  className={`${styles.productContent} hidden md:hidden lg:block`}
                  {...defaultYMotionProps}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <h3
                    className={`${styles.productTitle} text-start md:text-start`}
                  >
                    {product.title}
                  </h3>
                  <p className="w-full whitespace-pre-line">
                    {product.description}
                  </p>
                </motion.div>

                {/* Video */}
                <motion.div
                  className={`${styles.productVideo} w-full`}
                  {...defaultYMotionProps}
                  transition={{ duration: 1 }}
                >
                  <iframe
                    className="w-full h-auto md:w-[600px] aspect-video"
                    src={product.videoUrl}
                    title={product.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </motion.div>

                {/* sp */}
                <div className="product-content md:block lg:hidden flex flex-col gap-3 items-start md:w-[600px] mx-auto">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="w-full">{product.description}</p>
                </div>
              </div>
              <hr className="line" />
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default HighlightProduct;

import {
  createSmoothTextContainerMotionProps,
  createSmoothTextItemMotionProps,
} from "@/config/motion_config";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { preconnect } from "react-dom";
import highlightProductsData from "./highlightProduct";

const HighlightProduct = () => {
  const highlightAmount = 0.2;
  preconnect("https://www.google.com");
  preconnect("https://static.doubleclick.net");

  return (
    <Fragment>
      <div className="hightlight-product-container flex flex-col gap-[50px] md:gap-[100px]">
        <motion.h3
          className="text-[25px] sm:text-[30px] text-center uppercase font-medium"
          {...createSmoothTextContainerMotionProps(highlightAmount)}
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
                  className="hidden md:hidden lg:block"
                  {...createSmoothTextItemMotionProps(0.15, highlightAmount)}
                >
                  <h3 className="uppercase text-3xl font-medium text-start md:text-start mb-3">
                    {product.title}
                  </h3>
                  <p className="w-full whitespace-pre-line font-light italic">
                    {product.description}
                  </p>
                </motion.div>

                {/* Video */}
                <motion.div
                  className="w-full"
                  {...createSmoothTextContainerMotionProps(highlightAmount)}
                >
                  <iframe
                    className="w-full h-auto md:w-[600px] aspect-video rounded-[10px]"
                    src={product.videoUrl}
                    title={product.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </motion.div>

                {/* sp */}
                <div className="product-content md:block lg:hidden flex flex-col gap-3 items-start md:w-[600px] mx-auto">
                  <h3 className="product-title text-xl font-medium">
                    {product.title}
                  </h3>
                  <p className="w-full font-light italic">
                    {product.description}
                  </p>
                </div>
              </div>
              <hr className="mx-auto w-[80%]" />
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default HighlightProduct;

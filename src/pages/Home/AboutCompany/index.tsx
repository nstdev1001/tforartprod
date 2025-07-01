import styles from "./style.module.css";
import { defaultYMotionProps } from "@/config/motion_config";
import { motion } from "framer-motion";
import { Fragment, useMemo } from "react";
import { ReactTyped } from "react-typed";

const AboutCompany = () => {
  // Use useMemo to ensure the string array is stable across renders
  const typedContent = useMemo(
    () => [
      `<span class='font-semibold'>TFORART – Cùng Nhau Kiến Tạo Nghệ Thuật</span><br/><br/>Ra đời vào năm 2024, Tforat mang trong mình sứ mệnh kết nối nghệ thuật, sáng tạo và công nghệ, tạo nên những giá trị thẩm mỹ vượt thời gian. Chúng tôi hoạt động trong lĩnh vực nghệ thuật, media và sáng tạo nội dung, không ngừng đổi mới để mang đến những giải pháp sáng tạo chuyên nghiệp, giúp khách hàng khẳng định dấu ấn riêng trong thế giới truyền thông số.<br/><br/>Với phương châm "Together We Create Art", chúng tôi tin rằng nghệ thuật không chỉ là cái đẹp, mà còn là sự kết nối giữa con người, cảm xúc và câu chuyện. Từng sản phẩm mà TFORART tạo ra không chỉ đáp ứng tiêu chuẩn chất lượng cao mà còn chứa đựng tâm huyết, sự tinh tế và giá trị sáng tạo độc nhất.`,
    ],
    []
  );

  // Memoize typing parameters to keep them stable
  const typingConfig = useMemo(
    () => ({
      typeSpeed: 5,
      backSpeed: 0,
      cursorChar: "|",
      loop: false,
    }),
    []
  );

  return (
    <Fragment>
      <div className="about-wrapper flex flex-col md:flex-col lg:flex-row justify-center gap-20 mx-auto">
        <motion.img
          className="md:max-w-[600px] lg:max-w-[600px] h-auto rounded-ee-2xl bg-top object-cover mx-auto"
          src="/tforart_homepage_color.jpg"
          alt="Tforart team image"
          {...defaultYMotionProps}
          initial={{ opacity: 0, y: 100 }}
        />

        <div className="content-about-company md:max-w-[600px] flex flex-col items-start gap-5">
          <motion.h1
            className={`text-5xl font-semibold ${styles.gradientText}`}
            {...defaultYMotionProps}
          >
            <span className="font-thin">About</span>
            <p className="">&apos; TFORART &apos;</p>
          </motion.h1>
          <motion.div
            className="text-md flex flex-col gap-3"
            {...defaultYMotionProps}
            initial={{ opacity: 0, y: 80 }}
          >
            <div>
              <ReactTyped
                strings={typedContent}
                typeSpeed={typingConfig.typeSpeed}
                backSpeed={typingConfig.backSpeed}
                cursorChar={typingConfig.cursorChar}
                loop={typingConfig.loop}
                contentType="html"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </Fragment>
  );
};

export default AboutCompany;

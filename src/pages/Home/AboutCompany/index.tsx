import { motion } from "framer-motion";
import { Fragment } from "react";
import { preload } from "react-dom";
import styles from "./style.module.css";

const AboutCompany = () => {
  preload("/images/branding/tforart_studio_white.jpg", { as: "image" });

  const aboutParagraphs = [
    "TFORART – Cùng Nhau Kiến Tạo Nghệ Thuật",
    "Ra đời vào năm 2024, Tforart mang trong mình sứ mệnh kết nối nghệ thuật, sáng tạo và công nghệ, tạo nên những giá trị thẩm mỹ vượt thời gian. Chúng tôi hoạt động trong lĩnh vực nghệ thuật, media và sáng tạo nội dung, không ngừng đổi mới để mang đến những giải pháp sáng tạo chuyên nghiệp, giúp khách hàng khẳng định dấu ấn riêng trong thế giới truyền thông số.",
    'Với phương châm "Together We Create Art", chúng tôi tin rằng nghệ thuật không chỉ là cái đẹp, mà còn là sự kết nối giữa con người, cảm xúc và câu chuyện. Từng sản phẩm mà TFORART tạo ra không chỉ đáp ứng tiêu chuẩn chất lượng cao mà còn chứa đựng tâm huyết, sự tinh tế và giá trị sáng tạo độc nhất.',
  ];

  return (
    <Fragment>
      <div className="about-wrapper flex flex-col justify-center gap-20">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 1.04, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <img
            className="h-auto rounded-ee-2xl bg-top object-cover mx-auto"
            src="/images/branding/tforart_studio_white.jpg"
            alt="Tforart team image"
          />
        </motion.div>

        <motion.div
          className="content-about-company flex flex-col items-start gap-5"
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h1
            className={`text-5xl font-semibold ${styles.gradientText}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <span className="font-thin">About</span>
            <p>&apos; TFORART &apos;</p>
          </motion.h1>
          <div className="text-md flex flex-col gap-3">
            {aboutParagraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                className={index === 0 ? "font-semibold" : ""}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + index * 0.15 }}
                viewport={{ once: true, amount: 0.25 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </Fragment>
  );
};

export default AboutCompany;

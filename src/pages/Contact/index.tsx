import {
  createSmoothTextContainerMotionProps,
  createSmoothTextItemMotionProps,
} from "@/config/motion_config";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import FormContent from "./FormContent/FormContent";

const contactTextAmount = 0.4;

const Contact = () => {
  return (
    <Fragment>
      <div className="contact-container max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[200px] flex flex-col lg:flex-row items-center gap-20 md:gap-28 mx-auto">
        <motion.div
          className="text-hero w-[350px] md:w-[400px] flex flex-col gap-5"
          {...createSmoothTextContainerMotionProps(contactTextAmount)}
        >
          <motion.h1
            className="text-4xl font-semibold"
            {...createSmoothTextItemMotionProps(0.15, contactTextAmount)}
          >
            Have projects in mind? Let&apos;s work
            <motion.span
              className="text-5xl md:text-6xl block"
              {...createSmoothTextItemMotionProps(0.3, contactTextAmount)}
            >
              together
            </motion.span>
          </motion.h1>
          <motion.p
            className=""
            {...createSmoothTextItemMotionProps(0.45, contactTextAmount)}
          >
            Bạn đã sẵn sàng với dự án tiếp theo và cần một đội ngũ đồng hành?
            Hãy điền vào biểu mẫu, chúng tôi sẽ liên hệ trong thời gian sớm
            nhất!
          </motion.p>
          <motion.div
            {...createSmoothTextItemMotionProps(0.6, contactTextAmount)}
          >
            <Link
              className="text-xl flex items-center"
              to="mailto:tforartprod@gmail.com"
            >
              <i className="fa-solid fa-envelope"></i>
              <span className="ml-2 text-sm">tforartprod@gmail.com</span>
            </Link>
          </motion.div>
          <motion.div
            {...createSmoothTextItemMotionProps(0.75, contactTextAmount)}
          >
            <Link className="text-xl flex items-center" to="tel:+84365187269">
              <i className="fa-solid fa-phone"></i>
              <span className="ml-2 text-sm">0365.187.269</span>
            </Link>
          </motion.div>
        </motion.div>
        <div className="w-full max-w-[500px]">
          <FormContent />
        </div>
      </div>
    </Fragment>
  );
};

export default Contact;

import {
  createSmoothTextItemMotionProps,
  defaultYMotionProps,
} from "@/config/motion_config";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { preload } from "react-dom";
import Layout from "../../components/Layout/Layout";
import PcProfile from "./PcProfile";
import SpProfile from "./SpProfile";
import { profileData } from "./profileData";

profileData.forEach(({ imgUrl }) => {
  preload(imgUrl, { as: "image" });
});

const AboutUs = () => {
  const aboutTextAmount = 0.25;

  return (
    <Fragment>
      <Layout>
        <div className="about-us-container flex flex-col gap-20 max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[200px] mx-auto">
          <div className="text-info-wrapprer flex flex-col gap-5">
            <h1 className="uppercase text-5xl font-extrabold">
              Tforart&apos;s{" "}
              <motion.span
                className="font-thin"
                {...createSmoothTextItemMotionProps(0.3, aboutTextAmount)}
              >
                story
              </motion.span>
            </h1>
            <motion.div
              className="flex flex-col gap-3 text-md"
              {...createSmoothTextItemMotionProps(0.45, aboutTextAmount)}
            >
              <motion.p
                className="font-semibold italic"
                {...createSmoothTextItemMotionProps(0.6, aboutTextAmount)}
              >
                Tforart Story – Hành Trình Từ Đam Mê Đến Khẳng Định Vị Thế
              </motion.p>
              <motion.p
                {...createSmoothTextItemMotionProps(0.75, aboutTextAmount)}
              >
                Tforart được sinh ra từ những giấc mơ và đam mê cháy bỏng của
                bốn người trẻ, những con người luôn khao khát được thổi hồn nghệ
                thuật vào từng khung hình, từng câu chữ và từng dự án sáng tạo.
                Khởi đầu chỉ là một nhóm nhỏ tự mày mò, học hỏi và thử nghiệm
                trong lĩnh vực media, họ bắt đầu với những dự án cá nhân nhỏ,
                đơn giản nhưng chứa đựng tất cả tâm huyết và sự sáng tạo không
                ngừng.
              </motion.p>
              <motion.p
                {...createSmoothTextItemMotionProps(0.9, aboutTextAmount)}
              >
                Những sản phẩm đầu tiên được chia sẻ trên các nền tảng mạng xã
                hội đã gây được tiếng vang bất ngờ, thu hút sự chú ý của những
                khách hàng đầu tiên. Từ đó, chất lượng sản phẩm dần được nâng
                cao, quy mô dự án ngày càng mở rộng, và nhóm bắt đầu nhận ra
                tiềm năng to lớn của mình. Với niềm tin mãnh liệt vào sức mạnh
                của nghệ thuật và sự hợp tác, họ quyết định chính thức thành lập
                Tforart vào năm 2024, với mong muốn mang đến những giải pháp
                sáng tạo chuyên nghiệp hơn, phục vụ không chỉ các cá nhân mà cả
                các doanh nghiệp lớn nhỏ.
              </motion.p>
              <motion.p
                {...createSmoothTextItemMotionProps(1.05, aboutTextAmount)}
              >
                Chỉ sau vài tháng hoạt động, Tforart đã nhanh chóng khẳng định
                vị thế của mình trong ngành truyền thông và media. Những dự án
                thành công với các tên tuổi lớn như Viettel AI, Panasonic, và
                Baker McKenzie đã trở thành minh chứng rõ ràng nhất cho sự
                chuyên nghiệp, tận tâm và khả năng sáng tạo không giới hạn của
                đội ngũ Tforart. Mỗi dự án không chỉ là một câu chuyện nghệ
                thuật, mà còn là sự kết hợp hài hòa giữa ý tưởng độc đáo và
                chiến lược truyền thông hiệu quả, mang lại giá trị vượt trội cho
                khách hàng.
              </motion.p>
              <motion.p
                {...createSmoothTextItemMotionProps(1.2, aboutTextAmount)}
              >
                Hành trình của Tforart là hành trình của sự nỗ lực không ngừng,
                của niềm đam mê bất tận và của tinh thần &quot;cùng nhau kiến
                tạo nghệ thuật&quot;. Chúng tôi tin rằng, với sự đồng hành của
                khách hàng và đối tác, Tforart sẽ tiếp tục viết nên những trang
                sử mới, đưa nghệ thuật và sáng tạo lên những tầm cao mới.
              </motion.p>
              <motion.p
                className="font-semibold italic"
                {...createSmoothTextItemMotionProps(1.35, aboutTextAmount)}
              >
                Together We Create Art – Vì nghệ thuật là sự kết nối, chúng tôi
                luôn sẵn sàng đồng hành cùng bạn trên mọi hành trình sáng tạo!
              </motion.p>
            </motion.div>
          </div>

          <div className="profile-wrapper flex flex-col gap-5">
            <motion.h1
              className="uppercase text-3xl font-semibold"
              {...defaultYMotionProps}
            >
              Tforart&apos;s <span className="font-thin">people</span>
            </motion.h1>

            {/* PC layout */}
            <motion.section
              className="wrapper hidden lg:block"
              {...defaultYMotionProps}
              transition={{ duration: 2, delay: 0.5 }}
            >
              <PcProfile />
            </motion.section>

            {/* SP layout */}
            <motion.section
              className="wrapper block lg:hidden"
              {...defaultYMotionProps}
              transition={{ duration: 2, delay: 0.5 }}
            >
              <SpProfile />
            </motion.section>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export default AboutUs;

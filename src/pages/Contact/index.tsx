import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import Layout from "../../components/Layout/Layout";
import FormContent from "./FormContent/FormContent";

const Contact = () => {
  return (
    <Fragment>
      <Layout>
        <div className="contact-container max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[200px] flex flex-col lg:flex-row items-center gap-20 md:gap-28 mx-auto">
          <div className="text-hero w-[350px] md:w-[400px] flex flex-col gap-5">
            <h1 className="text-4xl font-semibold">
              Have projects in mind? Let&apos;s work
              <p className="text-5xl md:text-6xl">together</p>
            </h1>
            <p className="">
              Bạn đã sẵn sàng với dự án tiếp theo và cần một đội ngũ đồng hành?
              Hãy điền vào biểu mẫu, chúng tôi sẽ liên hệ trong thời gian sớm
              nhất!
            </p>
            <Link
              className="text-xl flex items-center"
              to="mailto:tforartprod@gmail.com"
            >
              <i className="fa-solid fa-envelope"></i>
              <span className="ml-2 text-sm">tforartprod@gmail.com</span>
            </Link>
            <Link className="text-xl flex items-center" to="tel:+84365187269">
              <i className="fa-solid fa-phone"></i>
              <span className="ml-2 text-sm">0365.187.269</span>
            </Link>
          </div>
          <div className="w-full max-w-[500px]">
            <FormContent />
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export default Contact;

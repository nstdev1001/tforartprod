import styles from "./Footer.module.css";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer
      className={`${styles.footerContainer} p-[50px] md:p-[100px] flex flex-col gap-[50px] md:gap-[80px]`}
    >
      <section className="footer-content-wrapper gap-[50px] flex flex-col md:flex-col lg:flex-row justify-around items-center">
        <img
          className="text-white h-[70px] md:h-[90px]"
          src="/tforart-main.png"
          alt="logo"
        />
        <div className="content flex flex-col gap-5 md:flex-row lg:flex-row justify-around md:gap-[100px] lg:gap-[200px] ">
          <div className="content-row content-row-1 text-center md:text-start flex flex-col gap-3 *:cursor-pointer">
            <Link to="/about-us">Giới thiệu</Link>
            <Link to="/services">Dịch vụ</Link>
            <Link to="/company-info">Thông tin doanh nghiệp</Link>
            <Link to="/privacy-policy">Quyền riêng tư</Link>
          </div>
          <div className="content-row content-row-2 text-center md:text-start flex flex-col gap-3 *:cursor-pointer">
            <Link to="/support/faq">FAQ</Link>
            <Link to="">
              Tforart Review
              <span className="font-thin text-gray-200">(Comming soon)</span>
            </Link>
            <Link to="/ai-chatbot">
              AI chatbot <span className="font-thin text-gray-200">(Beta)</span>
            </Link>
            <Link to="/support/weather">Weather</Link>
          </div>
          <div className="content-row content-row-3 text-center md:text-start flex flex-col gap-3 *:cursor-pointer">
            <Link to="">Watch</Link>
            <Link to="/developer-info">Developer</Link>
            <Link to="">Báo lỗi</Link>
            <Link
              to="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="hidden lg:block font-semibold"
            >
              LOGIN ADMIN
            </Link>
          </div>
        </div>
      </section>
      <hr className="w-[90%] mx-auto" />
      <section className="flex flex-col gap-5">
        <div
          className={`${styles.socialIconWrapper} flex justify-center gap-10`}
        >
          <Link
            to="https://web.facebook.com/TforartProduction"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-facebook-f"></i>
          </Link>
          <Link to="https://www.instagram.com/" target="_blank">
            <i className="fa-brands fa-instagram"></i>
          </Link>
          <Link to="https://x.com/tforartprod" target="_blank">
            <i className="fa-brands fa-x-twitter"></i>
          </Link>
          <Link to="https://www.youtube.com/@TforartProduction" target="_blank">
            <i className="fa-brands fa-youtube"></i>
          </Link>
          <Link to="" target="_blank">
            <i className="fa-brands fa-behance"></i>
          </Link>
        </div>
        <p className="text-center text-xs">
          © {currentYear} Tforart Production. All Rights Reserved.
        </p>
      </section>
    </footer>
  );
};

export default Footer;

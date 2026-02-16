import styles from "./Navbar.module.css";
import Clock from "./_components/Clock";
import AdminBar from "@/components/Admin/AdminBar";
import { navbarConfig } from "@/config/navbar_config";
import useAuth from "@/hooks/useAuth";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, checkIsLogin, handleSignOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Fragment>
      {/* hamburger button */}
      <div
        className={`${styles.menuToggleButton} block lg:hidden`}
        onClick={toggleMenu}
      >
        <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}>
          <span className={`${styles.bar} ${styles.bar1}`}></span>
          <span className={`${styles.bar} ${styles.bar2}`}></span>
          <span className={`${styles.bar} ${styles.bar3}`}></span>
        </div>
      </div>

      {/* navbar desktop */}
      <div
        className={`${styles.navbarPcContainer} hidden md:hidden lg:flex ${
          scroll && styles.navbarScroll
        }`}
      >
        <div className={styles.mainLogo}>
          <img
            className="w-[100px] cursor-pointer"
            src="/tforart_white.svg"
            alt="Logo"
            onClick={() => (window.location.href = "/")}
          />
        </div>
        <div className="flex gap-10 justify-around">
          <div className={`${styles.navItemWrapper} flex gap-10`}>
            {navbarConfig.map((item) => (
              <div
                key={item.url}
                className={`${styles.navItem} cursor-pointer uppercase ${
                  item.url === "/portfolio"
                    ? location.pathname.startsWith("/portfolio") &&
                      styles.active
                    : location.pathname === item.url && styles.active
                }`}
                onClick={() => {
                  navigate(item.url);
                  setIsMenuOpen(false);
                }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* navbar mobile */}
      <div
        className={`${styles.navbarSpContainer} fixed z-10 block lg:hidden w-full h-[55px]`}
      >
        <div className={styles.mobileLogo}>
          <img
            className="w-[80px] cursor-pointer"
            src="/Tforart-white.svg"
            alt="Mobile Logo"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* time */}
      <div
        className={`${styles.timeContainer} block lg:hidden`}
        onClick={() => navigate("/support/weather")}
      >
        <Clock />
      </div>

      {/* overlay */}
      {isMenuOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* sidebar */}
      <div
        className={`${
          styles.sideMenu
        } flex md:flex lg:hidden flex-col gap-10 p-5 ${
          isMenuOpen ? styles.open : ""
        }`}
      >
        <section className={`${styles.menuItem} flex flex-col gap-5 mt-[50px]`}>
          {navbarConfig.map((item) => (
            <div
              key={item.url}
              className={`${styles.navItem} cursor-pointer uppercase ${
                item.url === "/portfolio"
                  ? location.pathname.startsWith("/portfolio") && styles.active
                  : location.pathname === item.url && styles.active
              }`}
              onClick={() => {
                navigate(item.url);
                setIsMenuOpen(false);
              }}
            >
              {item.title}
            </div>
          ))}
        </section>

        <section className={`${styles.secondaryMenuItems} flex flex-col gap-3`}>
          <div className="border-t border-gray-600 my-4"></div>
          <div
            onClick={() => {
              navigate("/about-us");
              setIsMenuOpen(false);
            }}
          >
            Giới thiệu
          </div>
          <div
            onClick={() => {
              navigate("/services");
              setIsMenuOpen(false);
            }}
          >
            Dịch vụ
          </div>
          <div
            onClick={() => {
              navigate("/company-info");
              setIsMenuOpen(false);
            }}
          >
            Thông tin doanh nghiệp
          </div>
          <div
            onClick={() => {
              navigate("/support/faq");
              setIsMenuOpen(false);
            }}
          >
            FAQ
          </div>
          <div
            onClick={() => {
              navigate("/developer-info");
              setIsMenuOpen(false);
            }}
          >
            Developer
          </div>
        </section>
      </div>

      {checkIsLogin && (
        <AdminBar
          user={user}
          checkIsLogin={checkIsLogin}
          handleSignOut={handleSignOut}
        />
      )}
    </Fragment>
  );
};

export default Navbar;

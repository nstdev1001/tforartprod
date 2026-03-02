/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.pageYOffset > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [threshold]);

  if (!isVisible) return null;

  return (
    <motion.button
      className={`fixed bottom-6 right-6 text-white w-[40px] h-[40px] rounded-lg shadow-lg z-50 ${className}`}
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <i className="fa-light fa-arrow-up-to-line"></i>
    </motion.button>
  );
};

export default BackToTop;

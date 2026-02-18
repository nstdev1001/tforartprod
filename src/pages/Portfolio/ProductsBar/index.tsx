import styles from "./style.module.css";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductsBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultTab, setDefaultTab] = useState("");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("videos")) {
      setDefaultTab("video");
    } else if (path.includes("photos")) {
      setDefaultTab("photo");
    } else if (path.includes("graphics")) {
      setDefaultTab("graphic");
    }
  }, [location.pathname]);

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <Tabs value={defaultTab} className="flex justify-center">
      <TabsList
        className={`${styles.tabList} w-full md:w-auto lg:w-auto`}
        aria-label="tabs"
        role="tablist"
      >
        <TabsTrigger
          value="video"
          onClick={() => handleTabClick("/portfolio/videos")}
          className={styles.tabTrigger}
        >
          <span>Videos</span>
        </TabsTrigger>
        <TabsTrigger
          value="photo"
          onClick={() => handleTabClick("/portfolio/photos")}
          className={styles.tabTrigger}
        >
          <span>Photos</span>
        </TabsTrigger>
        <TabsTrigger
          value="graphic"
          onClick={() => handleTabClick("/portfolio/graphics")}
          className={styles.tabTrigger}
        >
          <span>Graphics</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProductsBar;

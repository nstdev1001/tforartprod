import React, { useEffect, useState } from "react";

interface AdminBarProps {
  user: { email: string | null } | null;
  checkIsLogin: boolean;
  handleSignOut: () => void | Promise<void>;
}

const AdminBar: React.FC<AdminBarProps> = ({
  user,
  checkIsLogin,
  handleSignOut,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto collapse on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!checkIsLogin) return null;

  const onSignOutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    void handleSignOut();
  };

  return (
    <div
      className={`fixed bottom-3 w-[280px] md:w-[300px] h-[90px] bg-amber-300 z-10 rounded-md shadow-lg transition-all duration-300 ease-in-out flex ${
        isCollapsed ? "-left-[248px] md:left-3" : "left-3"
      }`}
    >
      {/* Main content */}
      <div className="flex-1 relative">
        {user ? (
          <div className="absolute flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 w-full">
            <p className="text-black text-sm md:text-base truncate max-w-full">
              Hi <span className="font-bold">{user.email}</span>!
            </p>
            <p className="text-black text-sm md:text-base">
              Bạn đang ở chế độ admin.
            </p>
            <a
              href="#"
              onClick={onSignOutClick}
              className="underline text-red-700 text-sm md:text-base"
            >
              Đăng xuất
            </a>
          </div>
        ) : (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            Đang tải...
          </p>
        )}
      </div>

      {/* Toggle section - integrated into AdminBar */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-8 h-full bg-amber-400 hover:bg-amber-500 transition-colors rounded-r-md flex items-center justify-center md:hidden cursor-pointer"
        aria-label={isCollapsed ? "Mở Admin Bar" : "Thu gọn Admin Bar"}
      >
        <i
          className={`fa-solid text-black text-xs transition-transform duration-300 ${
            isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
          }`}
        ></i>
      </button>
    </div>
  );
};

export default AdminBar;

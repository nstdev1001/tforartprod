import React from "react";

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
  if (!checkIsLogin) return null;

  const onSignOutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    void handleSignOut();
  };

  return (
    <div
      className={`fixed bottom-3 left-3 w-[300px] h-[90px] bg-amber-300 z-10 rounded-md`}
    >
      {user ? (
        <div className="relative flex flex-col items-center top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
          <p className="text-black">
            Hi <span className="font-bold">{user.email}</span>!
          </p>
          <p className="text-black">Bạn đang ở chế độ admin.</p>
          <a
            href="#"
            onClick={onSignOutClick}
            className="underline text-red-700"
          >
            Đăng xuất
          </a>
        </div>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default AdminBar;

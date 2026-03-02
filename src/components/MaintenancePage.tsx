const MaintenancePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center mb-4">
        Trang web hiện đang bảo trì, vui lòng quay lại sau
      </h1>
      <p className="text-xl">Chúng tôi xin lỗi vì sự bất tiện này.</p>
      <img
        className="max-w-[400px]"
        src="/images/illustrations/maintain_web.gif"
        alt="Maintenance"
      />
    </div>
  );
};

export default MaintenancePage;

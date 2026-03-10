import { companyInfo } from "@/pages/CompanyInfo/companyInfoData";

const CompanyInfo = () => {
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="company-info-container flex flex-col gap-10 md:gap-20 max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[200px] mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {companyInfo.internationalName}
        </h1>
        <p className="text-lg text-gray-400">{companyInfo.abbreviation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
        <div className="rounded-lg md:p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Thông tin cơ bản
          </h2>

          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Mã số thuế</span>
              <span className="font-medium">{companyInfo.taxCode}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Địa chỉ</span>
              <span className="font-medium">{companyInfo.address}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Người đại diện</span>
              <span className="font-medium">
                {companyInfo.legalRepresentative}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Điện thoại</span>
              <span className="font-medium">{companyInfo.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg md:p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Tình trạng hoạt động
          </h2>

          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Ngày hoạt động</span>
              <span className="font-medium">
                {formatDate(companyInfo.foundingDate)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Quản lý bởi</span>
              <span className="font-medium">{companyInfo.managedBy}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">
                Loại hình doanh nghiệp
              </span>
              <span className="font-medium">{companyInfo.businessType}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Tình trạng</span>
              <span className="font-medium text-green-600">
                {companyInfo.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Ngành nghề chính
        </h2>
        <div className="whitespace-pre-line">
          {companyInfo.mainBusinessSector}
        </div>
      </div>

      <div className="rounded-lg md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">
          Các ngành nghề kinh doanh
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {companyInfo.businessSectors.map((sector) => (
            <div key={sector.id} className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500">
                  Mã ngành: {sector.id}
                </span>
              </div>
              <div className="whitespace-pre-line">{sector.sector}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;

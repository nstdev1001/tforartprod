import { ArrowRight, Clapperboard, Film, Play, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { companyInfo } from "../CompanyInfo/companyInfoData";

const CompanyServices = () => {
  const navigate = useNavigate();
  const mainServices = [
    {
      id: 1,
      title: "Sản Xuất Phim",
      description:
        "Sáng tạo và sản xuất phim chuyên nghiệp với chất lượng cao và cách tiếp cận nghệ thuật độc đáo.",
      icon: <Film className="w-10 h-10 mb-4 text-white" />,
    },
    {
      id: 2,
      title: "Sản Xuất Chương Trình Truyền Hình",
      description:
        "Phát triển và sản xuất các chương trình truyền hình hấp dẫn được thiết kế phù hợp với từng đối tượng khán giả cụ thể.",
      icon: <Tv className="w-10 h-10 mb-4 text-white" />,
    },
    {
      id: 3,
      title: "Hậu Kỳ",
      description:
        "Dịch vụ hậu kỳ toàn diện bao gồm biên tập, hiệu ứng hình ảnh, chỉnh màu và thiết kế âm thanh chuyên nghiệp.",
      icon: <Clapperboard className="w-10 h-10 mb-4 text-white" />,
    },
    {
      id: 4,
      title: "Phát Hành Nội Dung",
      description:
        "Phân phối chiến lược nội dung phim và video trên nhiều nền tảng để tiếp cận đúng đối tượng khán giả mục tiêu.",
      icon: <Play className="w-10 h-10 mb-4 text-white" />,
    },
  ];

  return (
    <div className="min-h-screen text-white flex flex-col gap-1 md:gap-20 max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[200px] mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-5">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 text-center">
          DỊCH VỤ CỦA CHÚNG TÔI
        </h1>

        <p className="text-lg text-gray-400 ">
          TFORART là một trong những đơn vị tiên phong trong lĩnh vực sản xuất
          nội dung truyền thông tại Việt Nam. Chúng tôi tự hào mang đến những
          tác phẩm điện ảnh, video quảng cáo, chương trình truyền hình sáng tạo
          và bộ sưu tập hình ảnh nhiếp ảnh đẳng cấp. Bằng sự kết hợp giữa công
          nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam
          kết tạo ra những sản phẩm truyền thông không chỉ thu hút về mặt thị
          giác mà còn truyền tải hiệu quả thông điệp của khách hàng đến với công
          chúng.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mainServices.map((service) => (
          <div
            key={service.id}
            className="border border-gray-800 rounded-lg p-8 transition-all duration-300 hover:bg-gray-900 flex flex-col"
          >
            <div className="p-3 rounded-full bg-gray-900 w-fit mb-4">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
            <p className="text-gray-400">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Process Section */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Quy Trình Làm Việc
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-start">
              <span className="text-4xl font-bold text-gray-700 mr-4">01</span>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Tư Vấn & Lên Ý Tưởng
                </h3>
                <p className="text-gray-400">
                  Thảo luận về mục tiêu dự án và phát triển ý tưởng sáng tạo phù
                  hợp.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-start">
              <span className="text-4xl font-bold text-gray-700 mr-4">02</span>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Sản Xuất & Quay Phim
                </h3>
                <p className="text-gray-400">
                  Thực hiện sản xuất với đội ngũ chuyên nghiệp và thiết bị hiện
                  đại.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-start">
              <span className="text-4xl font-bold text-gray-700 mr-4">03</span>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Hậu Kỳ & Phát Hành
                </h3>
                <p className="text-gray-400">
                  Hoàn thiện sản phẩm và triển khai chiến lược phát hành hiệu
                  quả.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 border border-gray-800 rounded-lg p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Sẵn sàng hiện thực hóa ý tưởng của bạn?
            </h3>
            <p className="text-gray-400">
              Liên hệ ngay để thảo luận về nhu cầu và mục tiêu dự án của bạn.
            </p>
          </div>
          <button
            onClick={() => navigate("/contact")}
            className="group flex items-center bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Liên Hệ Ngay
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Company Information */}
      <div className="mt-24 text-center">
        <h3 className="text-2xl font-bold mb-6">TFORART COMPANY LIMITED</h3>
        <p className="text-gray-400 mb-2">Địa chỉ: {companyInfo.address}</p>
        <p className="text-gray-400 mb-2">
          Điện thoại: {companyInfo.phoneNumber} | Email: {companyInfo.email}
        </p>
        <p className="text-gray-400">Mã số thuế: {companyInfo.taxCode}</p>
      </div>
    </div>
  );
};

export default CompanyServices;

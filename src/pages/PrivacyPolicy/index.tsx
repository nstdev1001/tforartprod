import { companyInfo } from "@/pages/CompanyInfo/companyInfoData";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[150px] mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          CHÍNH SÁCH QUYỀN RIÊNG TƯ
        </h1>
        <p className="text-lg text-gray-600">{companyInfo.internationalName}</p>
      </div>

      <div className="rounded-lg p-6 md:p-8 shadow-sm mb-10">
        <p className="mb-6 leading-relaxed">
          Tại {companyInfo.internationalName} (sau đây gọi tắt là &quot;
          {companyInfo.abbreviation}&quot;), chúng tôi coi trọng quyền riêng tư
          của quý khách hàng và đối tác. Chính sách này nhằm giải thích cách
          chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân của
          bạn khi bạn truy cập trang web của chúng tôi hoặc sử dụng dịch vụ của
          chúng tôi.
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Thông tin chúng tôi thu thập
          </h2>
          <p className="mb-3">
            Chúng tôi có thể thu thập các loại thông tin sau:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Thông tin cá nhân: tên, địa chỉ email, số điện thoại, địa chỉ liên
              lạc
            </li>
            <li>
              Thông tin giao dịch: chi tiết về các dịch vụ bạn đã sử dụng hoặc
              đang quan tâm
            </li>
            <li>
              Thông tin kỹ thuật: địa chỉ IP, loại trình duyệt, thiết bị truy
              cập và hệ điều hành
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Mục đích sử dụng thông tin
          </h2>
          <p className="mb-3">Chúng tôi sử dụng thông tin thu thập được để:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Cung cấp, vận hành và duy trì các dịch vụ sản xuất phim, video và
              chương trình truyền hình
            </li>
            <li>Cải thiện và cá nhân hóa trải nghiệm người dùng của bạn</li>
            <li>
              Liên lạc với bạn về các dịch vụ, thông báo, sự kiện và cập nhật
            </li>
            <li>
              Phân tích cách bạn sử dụng dịch vụ để tối ưu hóa hiệu suất website
              và dịch vụ
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Chia sẻ thông tin
          </h2>
          <p className="mb-3">
            {companyInfo.abbreviation} cam kết không bán, trao đổi hoặc chuyển
            giao thông tin cá nhân của bạn cho bên thứ ba nào khác mà không có
            sự đồng ý của bạn, ngoại trừ:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Đối tác cung cấp dịch vụ hỗ trợ hoạt động của chúng tôi</li>
            <li>Khi được yêu cầu bởi pháp luật hoặc cơ quan chức năng</li>
            <li>
              Để bảo vệ quyền, tài sản hoặc sự an toàn của{" "}
              {companyInfo.abbreviation}, khách hàng của chúng tôi hoặc người
              khác
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Bảo mật thông tin
          </h2>
          <p className="leading-relaxed">
            Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông
            tin cá nhân của bạn khỏi truy cập trái phép, tiết lộ, thay đổi và
            hủy. Tuy nhiên, không có phương thức truyền tải qua internet hoặc
            phương thức lưu trữ điện tử nào là an toàn 100%.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Thời gian lưu trữ
          </h2>
          <p className="leading-relaxed">
            Chúng tôi chỉ lưu giữ thông tin cá nhân của bạn trong thời gian cần
            thiết cho mục đích mà chúng tôi thu thập thông tin đó, hoặc theo yêu
            cầu của pháp luật.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Quyền của bạn
          </h2>
          <p className="mb-3">Bạn có quyền:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Truy cập thông tin cá nhân mà chúng tôi nắm giữ về bạn</li>
            <li>Yêu cầu chúng tôi sửa đổi thông tin không chính xác</li>
            <li>Yêu cầu xóa thông tin của bạn trong một số trường hợp</li>
            <li>
              Phản đối việc xử lý thông tin của bạn trong một số trường hợp
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Liên hệ</h2>
          <p className="mb-4 leading-relaxed">
            Nếu bạn có bất kỳ câu hỏi nào về Chính sách Quyền riêng tư này, vui
            lòng liên hệ với chúng tôi:
          </p>
          <div className="rounded-lg">
            <p className="font-semibold mb-2">
              {companyInfo.internationalName}
            </p>
            <p className="mb-1">
              <span className="font-medium">Địa chỉ:</span>{" "}
              {companyInfo.address}
            </p>
            <p className="mb-1">
              <span className="font-medium">Điện thoại:</span>{" "}
              {companyInfo.phoneNumber}
            </p>
            <p>
              <span className="font-medium">Email:</span> {companyInfo.email}
            </p>
          </div>
        </div>

        <div className="mt-10 text-sm text-gray-600 border-t pt-4">
          <p>
            Chính sách này có hiệu lực từ ngày 01/01/2025 và có thể được cập
            nhật theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay
            đổi nào thông qua trang web của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

export interface ProfileData {
  id: string;
  name: string;
  imgUrl: string;
  role: string;
  description: string;
}

export const profileData: ProfileData[] = [
  {
    id: "c1",
    name: "Vĩnh Vĩnh",
    imgUrl: "/Profile_TFORART_design/Vinh.png",
    role: "Filmmaker",
    description:
      "“Filmmaking is about patience, passion, and a little bit of madness.” ",
  },
  {
    id: "c2",
    name: "Nguyễn Sơn Tùng",
    imgUrl: "/Profile_TFORART_design/Tung.png",
    role: "Filmmaker",
    description:
      "“Với tôi, những thước phim không chỉ là khung hình chuyển động; nó còn là cảm xúc, là tâm hồn, là động lực để mình sáng tạo nhiều hơn nữa.”",
  },
  {
    id: "c3",
    name: "Lê Trường Giang",
    imgUrl: "/Profile_TFORART_design/Giang.png",
    role: "Photographer",
    description:
      "Beautiful moments come unexpectedly. That is one of the best things about photography.",
  },
  {
    id: "c4",
    name: "Phạm Quang Hải",
    imgUrl: "/Profile_TFORART_design/Hai.png",
    role: "Graphic Designer",
    description:
      "Thiết kế đồ họa là nghệ thuật thị giác, nơi ý tưởng hóa thành hình, cảm xúc hóa thành màu sắc, và thông điệp vang vọng qua từng đường nét.",
  },
  {
    id: "c5",
    name: "Nguyễn Thanh Hà",
    imgUrl: "/Profile_TFORART_design/Ha.png",
    role: "Photographer",
    description:
      "“Điều tốt nhất ở một bức ảnh đó là nó sẽ không bao giờ thay đổi, ngay cả khi con người đó đã thay đổi”.",
  },
  {
    id: "c6",
    name: "Nguyễn Duy Phong",
    imgUrl: "/Profile_TFORART_design/Phong.png",
    role: "Graphic Designer",
    description:
      "Thiết kế đẹp là thiết kế biết tự nói thay lời người sáng tạo. Mỗi tác phẩm tôi làm ra đều mang theo một câu chuyện riêng. Và tôi luôn cố gắng để câu chuyện ấy thật rõ ràng, sống động.",
  },
];

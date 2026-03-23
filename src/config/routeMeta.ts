export const APP_TITLE = "TFORART Production";
export const DEFAULT_SEO_DESCRIPTION =
  "TFORART Production - Agency sáng tạo nội dung hình ảnh, video và giải pháp truyền thông số cho doanh nghiệp.";
export const DEFAULT_SEO_KEYWORDS = [
  "TFORART",
  "production",
  "chụp ảnh",
  "quay phim",
  "thiết kế đồ hoạ",
  "truyền thông",
];

export type RouteMeta = {
  title: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  noIndex?: boolean;
};

export const routeMeta: Record<string, RouteMeta> = {
  "/": {
    title: "Trang chủ",
    description:
      "Khám phá dịch vụ sản xuất video, album ảnh và thiết kế đồ hoạ chuyên nghiệp tại TFORART Production.",
  },
  "/home": {
    title: "Trang chủ",
    canonicalPath: "/",
  },
  "/login": {
    title: "Đăng nhập",
    noIndex: true,
  },
  "/about-us": { title: "Giới thiệu" },
  "/services": { title: "Dịch vụ" },
  "/contact": { title: "Liên hệ" },
  "/company-info": { title: "Thông tin công ty" },
  "/privacy-policy": { title: "Chính sách bảo mật" },
  "/support/faq": { title: "Câu hỏi thường gặp" },
  "/support/weather": { title: "Thời tiết" },
  "/support/gold-price": { title: "Giá vàng" },
  "/developer-info": { title: "Thông tin nhà phát triển" },
  "/ai-chatbot": { title: "AI Chatbot" },
  "/portfolio": { title: "Portfolio" },
  "/portfolio/videos": { title: "Portfolio - Video" },
  "/portfolio/photos": { title: "Portfolio - Album ảnh" },
  "/portfolio/photos/:id/:albumSlug": {
    title: "Portfolio - Chi tiết album ảnh",
  },
  "/portfolio/graphics": { title: "Portfolio - Thiết kế đồ hoạ" },
  "/portfolio/graphics/:id/:albumSlug": {
    title: "Portfolio - Chi tiết dự án đồ hoạ",
  },
  "/test-error": { title: "Kiểm thử lỗi", noIndex: true },
  "/404": { title: "Không tìm thấy trang", noIndex: true },
};

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
};

const pathPatternToRegExp = (pathPattern: string) => {
  const escaped = pathPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const dynamicSegments = escaped.replace(/:[^/]+/g, "[^/]+");
  return new RegExp(`^${dynamicSegments}$`);
};

export const getRouteMetaByPath = (pathname: string): RouteMeta | undefined => {
  const normalizedPath = normalizePath(pathname);
  const exactMatch = routeMeta[normalizedPath];
  if (exactMatch) {
    return exactMatch;
  }

  const dynamicRouteEntry = Object.entries(routeMeta).find(([routePath]) =>
    routePath.includes(":")
      ? pathPatternToRegExp(routePath).test(normalizedPath)
      : false,
  );

  return dynamicRouteEntry?.[1];
};

export const buildDocumentTitle = (pathname: string) => {
  const matchedMeta = getRouteMetaByPath(pathname);
  if (!matchedMeta?.title) {
    return APP_TITLE;
  }

  return `${matchedMeta.title} | ${APP_TITLE}`;
};

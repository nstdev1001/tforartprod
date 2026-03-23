import {
  APP_TITLE,
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_KEYWORDS,
  buildDocumentTitle,
  type RouteMeta,
} from "@/config/routeMeta";
import { Helmet } from "react-helmet-async";

type SEOProps = {
  pathname: string;
  routeMeta?: RouteMeta;
};

const SEO = ({ pathname, routeMeta }: SEOProps) => {
  const title = buildDocumentTitle(pathname);
  const description = routeMeta?.description ?? DEFAULT_SEO_DESCRIPTION;
  const keywords = routeMeta?.keywords ?? DEFAULT_SEO_KEYWORDS;
  const robots = routeMeta?.noIndex ? "noindex,nofollow" : "index,follow";
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const canonicalPath = routeMeta?.canonicalPath ?? pathname;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={APP_TITLE} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;

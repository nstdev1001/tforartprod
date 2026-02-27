// ── CORS helper ──
const ALLOWED_ORIGINS = [
  "https://tforart.vn",
  "https://tforart-dev.web.app",
  "https://tforart-dev.firebaseapp.com",
];

export function setCors(
  req: { headers: { origin?: string } },
  res: { setHeader: (key: string, value: string) => void },
) {
  const origin = req.headers.origin ?? "";
  if (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.startsWith("http://localhost")
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "3600");
}

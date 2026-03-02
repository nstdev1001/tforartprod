import { preconnect, prefetchDNS } from "react-dom";

export default function ResourceHints() {
  // ── YouTube ──
  preconnect("https://www.youtube.com");
  prefetchDNS("https://img.youtube.com");

  // ── Firebase ──
  prefetchDNS("https://identitytoolkit.googleapis.com");
  prefetchDNS("https://firebaseinstallations.googleapis.com");
  prefetchDNS("https://firebasestorage.googleapis.com");

  // ── EmailJS ──
  prefetchDNS("https://api.emailjs.com");

  return null;
}

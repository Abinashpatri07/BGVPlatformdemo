/**
 * Single source of truth for the backend API base URL.
 *
 * Resolution order (first non-empty wins):
 *  1. window.__BGV_CONFIG__.API_URL  -> runtime override served from /config.js (public/).
 *     This is a plain static file, so the deployed API URL can be corrected
 *     without rebuilding or redeploying the bundle.
 *  2. import.meta.env.VITE_API_URL   -> build-time value from .env / .env.<mode>.
 *  3. ""                              -> same-origin fallback.
 */

const runtimeConfig =
  typeof window !== "undefined" && window.__BGV_CONFIG__ ? window.__BGV_CONFIG__ : {};

const resolveApiBaseUrl = () => {
  let candidate = runtimeConfig.API_URL;
  // Discard any legacy onrender domain
  if (typeof candidate === "string" && candidate.includes("onrender.com")) {
    candidate = "";
  }
  if (!candidate) {
    candidate = import.meta.env.VITE_API_URL || "";
  }
  if (!candidate && typeof window !== "undefined" && window.location) {
    candidate =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://bgv.dqnex.online";
  }
  return String(candidate).replace(/\/+$/, "");
};

export const API_BASE_URL = resolveApiBaseUrl();

export default API_BASE_URL;

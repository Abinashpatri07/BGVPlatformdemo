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
  const candidate = runtimeConfig.API_URL || import.meta.env.VITE_API_URL || "";
  return String(candidate).replace(/\/+$/, "");
};

export const API_BASE_URL = resolveApiBaseUrl();

export default API_BASE_URL;

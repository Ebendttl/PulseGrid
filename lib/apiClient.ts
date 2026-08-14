import axios from "axios";

// Local dev uses json-server on port 3001 (set NEXT_PUBLIC_API_URL=http://localhost:3001).
// Production (Vercel) uses the built-in Next.js API route at /api/data.
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined"
    ? `${window.location.origin}/api/data`
    : "/api/data");

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor: attach session token / auth header if present
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pg_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401 unauth redirects
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      if (window.location.pathname !== "/login") {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
      }
    }
    return Promise.reject(error);
  }
);

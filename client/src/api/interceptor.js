import api from "./axios.js";
import useAuthStore from "../store/useAuthStore.js";

const setupInterceptors = () => {
  // Access token injection
  api.interceptors.request.use(
    (config) => {
      const { accessToken } = useAuthStore.getState();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // // Auto-refresh access token on 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const { user, accessToken, login, logout } = useAuthStore.getState();
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/refresh")
      ) {
        originalRequest._retry = true;

        try {
          const res = await api.post(`/auth/refresh`, null, {
            withCredentials: true,
          });

          login({ user: res.data.user, accessToken: res.data.accessToken }); // update Zustand store

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.log("Refresh token failed:", refreshError);

          useAuthStore.getState().logout();

          // Logout if refresh fails
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;

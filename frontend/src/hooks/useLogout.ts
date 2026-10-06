import { useNavigate, useLocation } from "react-router";

// Custom Modules
import { aksharApi } from "@/api";

export const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      if (accessToken) {
        await aksharApi.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          },
        );
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }

    if (location.pathname === "/") {
      window.location.reload();
      return;
    }

    navigate("/", { viewTransition: true });
  };
};
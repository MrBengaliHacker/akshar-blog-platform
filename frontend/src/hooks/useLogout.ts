import { useNavigate, useLocation } from "react-router";

// Custom Modules
import { aksharApi } from "@/api";

export const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return async () => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await aksharApi.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );
    if (response.status >= 400) return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    if (location.pathname === "/") {
      window.location.reload();
      return;
    }

    navigate("/", { viewTransition: true });
  };
};
import { useQuery } from "@tanstack/react-query";
import { refreshToken } from "../services/refreshToken";
import { useNavigate } from "react-router-dom";

export function useToken() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        navigate("/login");
        throw new Error("No user data found");
      }

      const { refreshTokenExpiration, accessTokenExpiration } = storedUser;

      if (Date.now() > refreshTokenExpiration) {
        localStorage.removeItem("user");
        throw new Error("Session expired. Please log in again.");
      }

      if (Date.now() > accessTokenExpiration) {
        try {
          return await refreshToken();
        } catch (err) {
          console.log(err);
          navigate("/login");
          throw new Error("Failed to refresh token. Please log in again.");
        }
      }

      return storedUser.accessToken;
    },
    retry: false,
    staleTime: 1200000, //Keep token for 20 minutes to avoid unnecessay refresh
  });
  return {
    data,
    isLoading,
  };
}

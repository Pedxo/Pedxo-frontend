import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutUser,
    mutationKey: ["user"],
    onSuccess: () => {
        toast.success("Logged out");
        queryClient.invalidateQueries("user");
      navigate("/login", { replace: true });
    },
    onError: () => {
      toast.error("Failed to log out");
    },
  });

  return {
    logout,
    isLoading,
  };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/apiAuth";
import { useUser } from "../../context/UserContext"; 

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout: contextLogout } = useUser(); // Get logout from UserContext

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutUser,
    mutationKey: ["user"],
    onSuccess: () => {
      // Clear everything in the correct order
      queryClient.removeQueries(); // Clear all queries
      contextLogout(); // Clear UserContext
      localStorage.removeItem("user"); // Clear localStorage
      
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to log out");
    },
  });

  return { logout, isLoading };
}
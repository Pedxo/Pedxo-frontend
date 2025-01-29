import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useLogin() {
  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: (details) => loginUser(details),
    mutationKey: ["user"],
    onError: (err) => {
      if (err && !err.response) {
        toast.error("Something went wrong");
      }
      const errorMessage = err.response.data.message;
      switch (errorMessage) {
        case "user is not found":
          toast.error("User does not exist");
          break;
        case "You have to verify you account before logging in":
          toast.error("Verify your account before logging in");
          break;
        case "Invalid Credentials":
          toast.error("Invalid email or Password");
          break;
        default:
          toast.error("Something went wrong");
          break;
      }
    },
  });
  return {
    login,
    isLoggingIn,
  };
}

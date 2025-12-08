import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/apiAuth";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function useLogin() {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: (details) => loginUser(details),
    mutationKey: ["user"],
    onError: (err, variables) => {
      const email = variables?.email;
      if (err && !err.response) {
        toast.error("Something went wrong");
      }
      const errorMessage = err.response.data.message;
      switch (errorMessage) {
        case "user is not found":
          toast.error("User does not exist");
          break;
        case "You have to verify you account before logging in. Check your mail for otp":
          toast.error("Verify your account before logging in");
          navigate("/account-verification", {state: {email}});
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

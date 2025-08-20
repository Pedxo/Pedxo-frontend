import { useMutation } from "@tanstack/react-query";
import { finalizeContract } from "../../services/apiContract";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useFinalizeContract() {
  const navigate = useNavigate();
  const { mutate: finalize, isPending: sendingForm } = useMutation({
    mutationKey: ["finalize-contract"],
    mutationFn: (data) => finalizeContract(data),
    onSuccess: (data) => {
      toast.success("Contract sent successfully");
      const contractData = data?.data;
      console.log(data);
      sessionStorage.removeItem("personal-info", JSON.stringify(contractData));
      sessionStorage.removeItem("currentStep");
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error("Something went wrong.Please try again");
      console.log(err);
    },
  });
  return {
    finalize,
    sendingForm,
  };
}

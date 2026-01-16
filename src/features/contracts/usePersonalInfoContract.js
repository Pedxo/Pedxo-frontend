import { useMutation } from "@tanstack/react-query";
import { createContractOne } from "../../services/apiContract";
import toast from "react-hot-toast";

export default function usePersonalInfoContract() {
  const { mutate: postForm, isPending: isLoading } = useMutation({
    mutationFn: (details) => createContractOne(details),
    mutationKey: ["personal-info-form"],
    onSuccess: (data) => {
      toast.success("Action Saved")
      const contractData = data?.data;
      sessionStorage.setItem("personal-info", JSON.stringify(contractData))
    },
    onError: (err) => {
      toast.error("Saving Failed, Please try again");
      console.log(err);
    },
  });
  return {
    postForm,
    isLoading,
  };
}

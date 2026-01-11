import { useMutation } from "@tanstack/react-query";
import { updateFormTwo } from "../../services/apiContract";
import toast from "react-hot-toast";

export default function useJobDetailsForm() {
  const { mutate: updateForm, isPending: sendingForm } = useMutation({
    mutationFn: (details) => updateFormTwo(details),
    mutationKey: ["job-details"],
    onSuccess: (data) => {
        toast.success("Action Saved")
      const contractData = data?.data;
      console.log(data)
      sessionStorage.setItem("personal-info", JSON.stringify(contractData));
    },
    onError: (err) => {
      toast.error("Saving Failed, Please try again");
      console.log(err);
    },
  });
  return {
    updateForm,
    sendingForm,
  };
}

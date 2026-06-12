import { useMutation } from "@tanstack/react-query";
import { updateFormTwo } from "../../services/apiContract";
import toast from "react-hot-toast";

export default function useJobDetailsForm() {
  const { mutate: updateForm, isPending: sendingForm } = useMutation({
    mutationFn: ({ contractId, ...details }) => {
      if(!contractId) {
        throw new Error(
          "Contract ID missing. Complete Form One first."
        );
      }
      return updateFormTwo({ contractId, ...details })
    },
    mutationKey: ["job-details"],
    onSuccess: (data) => {
      toast.success("Action Saved");
      const contractData = data?.data;
      console.log(data);
      sessionStorage.setItem("personal-info", JSON.stringify(contractData));
    },
    onError: (err) => {
      let errorMessage = "Saving Failed, Please try again";
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.map(e => e.message || e).join(", ");
        } else if (typeof errors === "object") {
          errorMessage = Object.values(errors).flat().join(", ");
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      console.log(err);
    },
  });
  
  return {
    updateForm,
    sendingForm,
  };
}
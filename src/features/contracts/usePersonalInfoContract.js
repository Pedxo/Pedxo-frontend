import { useMutation } from "@tanstack/react-query";
import { createContractOne } from "../../services/apiContract";
import toast from "react-hot-toast";

export default function usePersonalInfoContract() {
  const { mutate: postForm, isPending: isLoading } = useMutation({
    mutationFn: (details) => createContractOne(details),
    mutationKey: ["personal-info-form"],
    onSuccess: (data) => {
      toast.success("Action Saved");
      const contractData = data?.data;
      sessionStorage.setItem("personal-info", JSON.stringify(contractData));
    },
    onError: (err) => {
      // Try to extract the error message from the response
      let errorMessage = "Saving Failed, Please try again";
      
      // Check if error has response data with a message
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } 
      // Check if error has response data with errors object (common with validation errors)
      else if (err?.response?.data?.errors) {
        const errors = err.response.data.errors;
        // If it's an array of errors
        if (Array.isArray(errors)) {
          errorMessage = errors.map(e => e.message || e).join(", ");
        } 
        // If it's an object with field-specific errors
        else if (typeof errors === "object") {
          errorMessage = Object.values(errors).flat().join(", ");
        }
      }
      // Check if error has a message property directly
      else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      console.log(err);
    },
  });
  
  return {
    postForm,
    isLoading,
  };
}
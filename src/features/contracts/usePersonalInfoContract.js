import { useMutation } from "@tanstack/react-query";
import { createContractOne } from "../../services/apiContract";
import toast from "react-hot-toast";

export default function usePersonalInfoContract() {
  const { mutate: postForm, isPending: isLoading } = useMutation({
    mutationFn: (details) => createContractOne(details),
    mutationKey: ["personal-info-form"],
    onSuccess: (response) => {
      toast.success("Action Saved");

      console.log("CREATE CONTRACT FULL RESPONSE", response);
      const contractData =
        response?.data?.data ||   // FIXED (your real structure)
        response?.data;

      console.log("CONTRACT DATA", contractData);
      sessionStorage.setItem("personal-info", JSON.stringify(contractData));

      // Resolve contractId regardless of response structure
      const contractId =
        contractData?._id ||
        contractData?.contractId ||
        contractData?.id;


      console.log("RESOLVED CONTRACT ID", contractId);
      
      // Store contractId for subsequent API calls
      // if (contractData?._id) {
      //   sessionStorage.setItem("currentContractId", contractData._id);
      // }

      if (contractId) {
        sessionStorage.setItem("currentContractId", contractId);

        console.log(
          "CONTRACT ID SAVED TO SESSION STORAGE:",
          contractId
        );
      } else {
        console.error(
          "NO CONTRACT ID FOUND IN RESPONSE",
          contractData
        );
      }
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
    postForm,
    isLoading,
  };
}
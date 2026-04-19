import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finalizeContract } from "../../services/apiContract";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useFinalizeContract() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: finalize, isPending: sendingForm } = useMutation({
    mutationKey: ["finalize-contract"],
    mutationFn: ({ contractId, data, username }) => finalizeContract({ contractId, ...data }),
    onSuccess: (data, variables) => {
      toast.success("Contract sent successfully");
      console.log(data);
      
      // Clear session storage
      sessionStorage.removeItem("personal-info");
      sessionStorage.removeItem("currentStep");
      
      // Get username from variables
      const username = variables?.username;
      
      console.log("Invalidating queries for username:", username);
      
      // Invalidate queries
      setTimeout(() => {
        if (username) {
          queryClient.invalidateQueries({ 
            queryKey: ["user-contracts", username],
            refetchType: 'active'
          });
        }
        
        queryClient.invalidateQueries({ 
          queryKey: ["user-contracts"],
          refetchType: 'active'
        });
        
        if (username) {
          queryClient.refetchQueries({ 
            queryKey: ["user-contracts", username],
            type: 'active'
          });
        }
      }, 100);
      
      navigate("/dashboard");
    },
    onError: (err) => {
      let errorMessage = "Something went wrong. Please try again";
      
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
      } else if (err?.response?.data?.signature) {
        errorMessage = err.response.data.signature;
      }
      
      toast.error(errorMessage);
      console.log(err);
    },
  });
  
  return {
    finalize,
    sendingForm,
  };
}
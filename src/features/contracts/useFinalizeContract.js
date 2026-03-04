import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finalizeContract } from "../../services/apiContract";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useFinalizeContract() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: finalize, isPending: sendingForm } = useMutation({
    mutationKey: ["finalize-contract"],
    mutationFn: (data) => finalizeContract(data),
    onSuccess: (data, variables) => {
      toast.success("Contract sent successfully");
      console.log(data);
      
      // Clear session storage
      sessionStorage.removeItem("personal-info");
      sessionStorage.removeItem("currentStep");
      
      // Get username from multiple sources to ensure we have it
      let username = null;
      
      // Try to get from variables if passed
      if (variables?.username) {
        username = variables.username;
      } 
      // Try from session storage
      else {
        username = sessionStorage.getItem("username");
      }
      
      // Try from localStorage user object
      if (!username) {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          username = user?.username;
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
      
      console.log("Invalidating queries for username:", username);
      
      // Invalidate with a slight delay to ensure navigation happens after cache invalidation
      setTimeout(() => {
        if (username) {
          queryClient.invalidateQueries({ 
            queryKey: ["user-contracts", username],
            refetchType: 'active' // Only refetch active queries
          });
        }
        
        // Also invalidate without username as fallback
        queryClient.invalidateQueries({ 
          queryKey: ["user-contracts"],
          refetchType: 'active'
        });
        
        // Force refetch immediately
        queryClient.refetchQueries({ 
          queryKey: ["user-contracts", username],
          type: 'active'
        });
      }, 100);
      
      // Navigate back to dashboard
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error("Something went wrong. Please try again");
      console.log(err);
    },
  });
  
  return {
    finalize,
    sendingForm,
  };
}
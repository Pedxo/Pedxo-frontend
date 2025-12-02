import { useMutation } from "@tanstack/react-query";
import { finalizeContract } from "../../services/apiContract";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useFinalizeContract() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: ["finalize-contract"],
    mutationFn: async (data) => {
      console.log("[MUTATION] ===== MUTATION FUNCTION EXECUTING =====");
      console.log("[MUTATION] This log confirms the mutation function is running");
      console.log("[MUTATION] Data type:", data instanceof FormData ? "FormData" : typeof data);
      console.log("[MUTATION] About to call finalizeContract API...");
      
      if (!data) {
        console.error("[MUTATION] CRITICAL: No data provided to mutation!");
        throw new Error("No data provided to mutation");
      }
      
      try {
        console.log("[MUTATION] Calling finalizeContract...");
        const result = await finalizeContract(data);
        console.log("[MUTATION] finalizeContract API call completed");
        console.log("[MUTATION] Result:", result);
        console.log("[MUTATION] ===== MUTATION FUNCTION COMPLETE =====");
        return result;
      } catch (error) {
        console.error("[MUTATION] ===== ERROR IN MUTATION FUNCTION =====");
        console.error("[MUTATION] Error in mutationFn:", error);
        console.error("[MUTATION] Error details:", {
          message: error?.message,
          response: error?.response,
          stack: error?.stack
        });
        throw error;
      }
    },
    // Note: Callbacks passed to mutate() will be used instead of these
    // Keeping these as fallback if no callbacks are provided
    onSuccess: (data, variables, context) => {
      console.log("[SUCCESS] Contract Finalization Success (hook level - fallback)!");
      console.log("Full response:", data);
      console.log("Contract data:", data?.data);
      console.log("Response status:", data?.status || "success");
    },
    onError: (err, variables, context) => {
      console.error("[ERROR] Finalize contract error (hook level - fallback):", err);
      console.error("Error response:", err?.response?.data);
      console.error("Error status:", err?.response?.status);
    },
  });
  
  const { mutate: finalize, isPending: sendingForm } = mutation;
  
  return {
    finalize,
    sendingForm,
  };
}

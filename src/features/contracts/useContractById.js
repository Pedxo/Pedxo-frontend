import { useQuery } from "@tanstack/react-query";
import { getContractById } from "../../services/apiContract";

export default function useContractById(contractId) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["contract", contractId],
    queryFn: () => getContractById(contractId),
    enabled: !!contractId, // Only run if contractId exists
    retry: 1,
  });

  return {
    contract: data?.data || null, // Adjust based on your API response structure
    isLoading,
    error,
  };
}
import { useQuery } from "@tanstack/react-query";
import { getUserContracts } from "../../services/apiContract";

export default function useUserContracts() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user-contracts"],
    queryFn: () => getUserContracts(),
    retry: 1,
  });

  return {
    contracts: data?.data?.contracts || [], 
    total: data?.data?.total || 0,
    isLoading,
    error,
    refetch,
  };
}
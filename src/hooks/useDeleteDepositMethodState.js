import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepositMethod, deleteWithdrawMethod } from "../helper/helper.jsx"; // Adjust path as needed

export const useDeleteDepositMethodState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await deleteDepositMethod(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after update
      queryClient.invalidateQueries({ queryKey: ["depositMethods"] });
    },
    onError: (error) => {
      console.error("Error updating coin:", error);
    },
  });
};

export const useDeleteWithdrawMethodState = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (values) => {
        const response = await deleteWithdrawMethod(values);
        return response;
      },
      onSuccess: () => {
        // Invalidate the coin list cache to refresh data after update
        queryClient.invalidateQueries({ queryKey: ["withdrawMethods"] });
      },
      onError: (error) => {
        console.error("Error updating coin:", error);
      },
    });
  };
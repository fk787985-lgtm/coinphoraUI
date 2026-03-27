import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepositMethod, updateWithdrawMethod } from "../helper/helper.jsx"; // Adjust path as needed

export const useUpdateDepositMethodState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateDepositMethod(values);
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

export const useUpdateWithdrawMethodState = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (values) => {
        const response = await updateWithdrawMethod(values);
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
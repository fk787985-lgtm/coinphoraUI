import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepositMethod, createWithdrawMethod } from "../helper/helper.jsx"; // Adjust path as needed

export const useCreateDepositMethodState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await createDepositMethod(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["depositMethods"] });
    },
    onError: (error) => {
      console.error("Error creating coin:", error);
    },
  });
};

export const useCreateWithdrawMethodState = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (values) => {
        const response = await createWithdrawMethod(values);
        return response;
      },
      onSuccess: () => {
        // Invalidate the coin list cache to refresh data after creation
        queryClient.invalidateQueries({ queryKey: ["withdrawMethods"] });
      },
      onError: (error) => {
        console.error("Error creating coin:", error);
      },
    });
  };
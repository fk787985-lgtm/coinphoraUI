import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCoin } from "../helper/helper.jsx"; // Adjust path as needed

export const useCreateCoinState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await createCoin(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["coinList"] });
    },
    onError: (error) => {
      console.error("Error creating coin:", error);
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCoin } from "../helper/helper.jsx"; // Adjust path as needed

export const useUpdateCoinState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateCoin(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after update
      queryClient.invalidateQueries({ queryKey: ["coinList"] });
    },
    onError: (error) => {
      console.error("Error updating coin:", error);
    },
  });
};

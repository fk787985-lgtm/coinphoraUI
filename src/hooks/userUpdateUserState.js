import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepositMethod, updateUser , updateAdminPassword, updateSiteSetting, createTrade, createDeposit, updateDeposit, createWithdraw, updateWithdraw, createKyc, updateKyc, updateUserByUser, updateUserPasswordByUser, createTransfer} from "../helper/helper.jsx"; // Adjust path as needed

export const useUpdateUserState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateUser(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
export const useUpdateUserByUserState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateUserPasswordByUser(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
export const useUpdatePasswordByUserState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateUserPasswordByUser(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await createDepositMethod(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

export const useUpdateAdminPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateAdminPassword(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateSiteSetting(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });

      queryClient.invalidateQueries({ queryKey: ["userData"] });
      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

export const useUpdateCreateTrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await createTrade(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });

      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

export const useUpdateCreateDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await createDeposit(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });

      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
export const useUpdateCreateWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await createWithdraw(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });

      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

export const useUpdateCreateKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await createKyc(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });

      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
export const useUpdateUpdateDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateDeposit(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });
      queryClient.invalidateQueries({ queryKey: ["depositDetail"] });
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      queryClient.invalidateQueries({ queryKey: ["depositLog"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawLog"] });
      queryClient.invalidateQueries({ queryKey: ["transferLog"] });

      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

export const useUpdateUpdateKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateKyc(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });
      queryClient.invalidateQueries({ queryKey: ["depositDetail"] });
      queryClient.invalidateQueries({ queryKey: ["kycList"] });
      queryClient.invalidateQueries({ queryKey: ["depositLog"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawLog"] });
      queryClient.invalidateQueries({ queryKey: ["transferLog"] });

      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
export const useUpdateUpdateWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await updateWithdraw(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });
      queryClient.invalidateQueries({ queryKey: ["depositDetail"] });
      queryClient.invalidateQueries({ queryKey: ["withdraws"] });
      queryClient.invalidateQueries({ queryKey: ["depositLog"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawLog"] });
      queryClient.invalidateQueries({ queryKey: ["transferLog"] });

      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

export const useUpdateCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const response = await createTransfer(values);
      return response;
    },
    onSuccess: () => {
      // Invalidate the coin list cache to refresh data after creation
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      queryClient.invalidateQueries({ queryKey: ["useData"] });
      queryClient.invalidateQueries({ queryKey: ["getSiteSetting"] });

      

    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
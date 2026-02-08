import { PartyFormType } from "@/components/AddPartyModal";
import { Party, PartyDetail, PartySummary } from "@/lib/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePartyQuery = () => {
  return useQuery({
    queryKey: ["party"],
    queryFn: async (): Promise<{ data: Party[] }> => {
      const response = await fetch("/api/party", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch parties");
      }
      return response.json();
    },
  });
};

export const usePartyDetailQuery = (partyId: string) => {
  return useQuery({
    queryKey: ["party", partyId],
    queryFn: async (): Promise<{ data: PartyDetail }> => {
      const response = await fetch(`/api/party/${partyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch party details");
      }
      return response.json();
    },
    enabled: !!partyId,
  });
};

export const useAddPartyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PartyFormType) => {
      const response = await fetch("/api/party", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create party");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party"] });
    },
  });
};

export const useEditPartyMutation = (partyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PartyFormType) => {
      const response = await fetch(`/api/party/${partyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to edit party");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party"] });
    },
  });
};

export const useJoinPartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { inviteCode: string }) => {
      const response = await fetch("/api/party/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to join party");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party"] });
    },
  });
};

export const useLeavePartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (partyId: string) => {
      const response = await fetch(`/api/party/${partyId}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to leave party");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party"] });
    },
  });
};

export const useDeletePartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (partyId: string) => {
      const response = await fetch(`/api/party/${partyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete party");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party"] });
    },
  });
};

export const usePartySummaryQuery = (partyId: string) => {
  return useQuery({
    queryKey: ["party", partyId, "summary"],
    queryFn: async (): Promise<{ data: PartySummary }> => {
      const response = await fetch(`/api/party/${partyId}/summary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch party summary");
      }
      return response.json();
    },
    enabled: !!partyId,
  });
};

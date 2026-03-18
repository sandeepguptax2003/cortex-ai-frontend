"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useOrganisation() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["organisation"],
    queryFn: async () => {
      const response = await api.getOrganisation();
      return response.data;
    },
  });

  return {
    organisation: data,
    isLoading,
    error,
  };
}

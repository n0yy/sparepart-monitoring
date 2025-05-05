"use client";

import useSWR from "swr";

interface SpreadsheetData {
  title: string;
  data: any[];
}

interface MachineDataState {
  data: SpreadsheetData | null;
  loading: boolean;
  error: Error | null;
  mutate: () => void;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export function useMachineData(machineName: string | null): MachineDataState {
  const { data, error, isLoading, mutate } = useSWR(
    machineName ? `/api/machines/${machineName}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // Tidak revalidasi saat focus kembali
      revalidateIfStale: true, // Revalidasi jika data sudah stale
      revalidateOnReconnect: true, // Revalidasi saat koneksi kembali
      dedupingInterval: 60000, // Deduping interval 1 menit
    }
  );

  return {
    data: data || null,
    loading: isLoading,
    error: error as Error | null,
    mutate,
  };
}

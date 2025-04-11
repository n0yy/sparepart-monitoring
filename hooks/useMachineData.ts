"use client";

import { useEffect, useState } from "react";

interface SpreadsheetData {
  title: string;
  data: any[];
}

interface MachineDataState {
  data: SpreadsheetData | null;
  loading: boolean;
  error: string | null;
}

export function useMachineData(machineName: string): MachineDataState {
  const [state, setState] = useState<MachineDataState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await fetch(`/api/machines/${machineName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: SpreadsheetData = await response.json();
        setState((prev) => ({ ...prev, data, loading: false, error: null }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: (error as Error).message || "Error fetching data",
        }));
      }
    }
    fetchData();
  }, [machineName]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
  };
}

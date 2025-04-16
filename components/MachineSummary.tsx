"use client";

import { useMachineData } from "@/hooks/useMachineData";

interface MachineSummaryProps {
  machineName: string;
}

export default function MachineSummary({ machineName }: MachineSummaryProps) {
  const { data: spreadsheetData, loading, error } = useMachineData(machineName);

  if (loading) return <div className="skeleton w-full h-32"></div>;
  if (error) return <div className="text-error">Error: {error}</div>;

  // Hitung total sparepart per mesin
  const machineCounts = spreadsheetData?.data?.reduce(
    (acc: Record<string, number>, row) => {
      if (row.machine) {
        acc[row.machine] = (acc[row.machine] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Summary Sparepart</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Mesin</th>
                <th>Total Sparepart</th>
              </tr>
            </thead>
            <tbody>
              {machineCounts &&
                Object.entries(machineCounts).map(([machine, count]) => (
                  <tr key={machine}>
                    <td>{machine}</td>
                    <td>{count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

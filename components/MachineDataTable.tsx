"use client";

import { useMachineData } from "@/hooks/useMachineData";

export default function MachineDataTable({
  machineName,
}: {
  machineName: string;
}) {
  const { data: spreadsheetData, loading, error } = useMachineData(machineName);
  return (
    <div className="mt-6 w-full">
      <h2 className="text-xl font-semibold mb-5">{`Table ${machineName.toLocaleUpperCase()}`}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          {spreadsheetData!.data!.length > 0 ? (
            <table className="table table-sm table-zebra w-full mt-4">
              <thead>
                <tr>
                  <th>Kode Part</th>
                  <th>Part</th>
                  <th>Qty</th>
                  <th>Category</th>
                  <th>Penggantian Terakhir</th>
                  <th>Lifetime (Bulan)</th>
                  <th>Penggantian Selanjutnya</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {spreadsheetData!.data
                  .filter((row) => row.machine) // Filter out empty rows
                  .map((row, index) => (
                    <tr key={index}>
                      <td>{row.codePart}</td>
                      <td>{row.part}</td>
                      <td>{row.quantity}</td>
                      <td>{row.category}</td>
                      <td>{row.lastReplaced}</td>
                      <td>{row.lifetime}</td>
                      <td>{row.nextReplacement}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

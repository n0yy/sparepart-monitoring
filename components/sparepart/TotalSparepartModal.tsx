// file: app/dashboard/lifetime/[machine]/components/TotalSparepartModal.tsx
import { useState } from "react";
import Modal from "@/components/Modal";
import { MachineProps, SparepartRow } from "@/utils/CalculationPart";
import {
  calculateDaysUntilNextReplacement,
  filterSparepartsByMachine,
} from "@/utils/CalculationPart";

interface TotalSparepartModalProps extends MachineProps {
  onClose: () => void;
}

export default function TotalSparepartModal({
  machine,
  machineNumber,
  spreadsheetData,
  onClose,
}: TotalSparepartModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = filterSparepartsByMachine(
    spreadsheetData?.data,
    machine,
    machineNumber,
    searchQuery
  );

  return (
    <>
      <div className="fixed inset-0 bg-white/30 backdrop-blur z-40" />
      <Modal title="Total Sparepart Terpantau" onClose={onClose}>
        {/* Form Pencarian */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari part, kode, atau kategori..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Part</th>
                <th>Kategori</th>
                <th>Penggantian Terakhir</th>
                <th>Lifetime (Bulan)</th>
                <th>Sisa Hari</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((row) => (
                <tr key={row.codePart}>
                  <td className="px-4 py-2">{row.codePart}</td>
                  <td className="px-4 py-2">{row.part}</td>
                  <td className="px-4 py-2">{row.category}</td>
                  <td className="px-4 py-2">{row.lastReplaced}</td>
                  <td className="px-4 py-2">{row.lifetime}</td>
                  <td className="px-4 py-2">
                    {calculateDaysUntilNextReplacement(row.nextReplacement)}
                  </td>
                  <td className="px-4 py-2">
                    {row.status.includes("Segera") ? (
                      <span className="text-yellow-500 bg-yellow-500/20 px-3 py-1 rounded-full">
                        Perlu Diganti
                      </span>
                    ) : row.status.includes("Hari") ? (
                      <span className="text-green-500 bg-green-500/20 px-3 py-1 rounded-full">
                        OK
                      </span>
                    ) : (
                      <span className="text-red-500 bg-red-500/20 px-3 py-1 rounded-full">
                        Overdue
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData?.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}

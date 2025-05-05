import { useState } from "react";
import Modal from "@/components/Modal";
import { MachineProps } from "@/utils/CalculationPart";
import {
  calculateDaysUntilNextReplacement,
  filterSparepartsByMachine,
} from "@/utils/CalculationPart";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa6";

interface TotalSparepartModalProps extends MachineProps {
  onClose: () => void;
}

// Define a type for sort direction
type SortDirection = "none" | "asc" | "desc";

export default function TotalSparepartModal({
  machine,
  machineNumber,
  spreadsheetData,
  onClose,
}: TotalSparepartModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusSortDirection, setStatusSortDirection] =
    useState<SortDirection>("none");

  // Get the filtered data
  const filteredData = filterSparepartsByMachine(
    spreadsheetData?.data,
    machine,
    machineNumber,
    searchQuery
  );

  // Helper function to get status priority (for sorting)
  const getStatusPriority = (status: string | undefined): number => {
    if (!status) return 3; // Unknown status gets lowest priority
    if (status.includes("Segera") || status.includes("Perlu")) return 1; // "Perlu Diganti" - high priority
    if (status.includes("Overdue")) return 0; // "Overdue" - highest priority
    if (status.includes("Hari") || status.includes("OK")) return 2; // "OK" - lower priority
    return 3; // Default/unknown status
  };

  // Sort the data based on status
  const sortedData = [...(filteredData || [])].sort((a, b) => {
    if (statusSortDirection === "none") {
      return 0; // No sorting
    }

    const aPriority = getStatusPriority(a.status);
    const bPriority = getStatusPriority(b.status);

    return statusSortDirection === "asc"
      ? aPriority - bPriority
      : bPriority - aPriority;
  });

  // Toggle sort direction when column header is clicked
  const toggleStatusSort = () => {
    setStatusSortDirection((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      return "none";
    });
  };

  // Helper function to render status badge safely
  const renderStatusBadge = (status: string | undefined) => {
    // If status is undefined, return a default badge
    if (!status) {
      return (
        <span className="text-gray-500 bg-gray-500/20 px-3 py-1 rounded-full">
          Tidak Ada Status
        </span>
      );
    }

    // Check status values
    if (status.includes("Segera")) {
      return (
        <span className="text-yellow-500 bg-yellow-500/20 px-3 py-1 rounded-full">
          Perlu Diganti
        </span>
      );
    } else if (status.includes("Hari")) {
      return (
        <span className="text-green-500 bg-green-500/20 px-3 py-1 rounded-full">
          OK
        </span>
      );
    } else {
      return (
        <span className="text-red-500 bg-red-500/20 px-3 py-1 rounded-full">
          Overdue
        </span>
      );
    }
  };

  // Render the appropriate sort icon
  const renderSortIcon = () => {
    if (statusSortDirection === "asc") return <FaSortUp />;
    if (statusSortDirection === "desc") return <FaSortDown />;
    return <FaSort />;
  };

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
                <th className="cursor-pointer" onClick={toggleStatusSort}>
                  <div className="flex items-center space-x-2 hover:text-slate-800">
                    <span>Status</span>
                    <span>{renderSortIcon()}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => (
                <tr key={row.codePart}>
                  <td className="px-4 py-2">{row.codePart}</td>
                  <td className="px-4 py-2">{row.part}</td>
                  <td className="px-4 py-2">{row.category}</td>
                  <td className="px-4 py-2">{row.lastReplaced}</td>
                  <td className="px-4 py-2">{row.lifetime}</td>
                  <td className="px-4 py-2">
                    {calculateDaysUntilNextReplacement(row.nextReplacement)}
                  </td>
                  <td className="px-4 py-2 scale-90 text-xs">
                    {renderStatusBadge(row.status)}
                  </td>
                </tr>
              ))}
              {sortedData.length === 0 && (
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

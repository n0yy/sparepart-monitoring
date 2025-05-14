import { useState } from "react";
import Modal from "@/components/Modal";
import { MachineProps } from "@/utils/CalculationPart";
import {
  calculateDaysUntilNextReplacement,
  filterSparepartsByMachine,
} from "@/utils/CalculationPart";
import { FaSort, FaSortUp, FaSortDown, FaPrint } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

interface TotalSparepartModalProps extends MachineProps {
  onClose: () => void;
}

// Define a type for sort direction
type SortDirection = "none" | "asc" | "desc";

// Define available status options
type StatusOption = "all" | "overdue" | "ok" | "perluDiganti" | "noStatus";

export default function TotalSparepartModal({
  machine,
  machineNumber,
  spreadsheetData,
  onClose,
}: TotalSparepartModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusSortDirection, setStatusSortDirection] =
    useState<SortDirection>("none");
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>("all");

  // Get the filtered data by search query
  const searchFilteredData = filterSparepartsByMachine(
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

  // Filter data based on selected status
  const statusFilteredData = searchFilteredData?.filter((row) => {
    if (selectedStatus === "all") return true;
    if (selectedStatus === "overdue" && row.status?.includes("Melewati"))
      return true;
    if (
      selectedStatus === "ok" &&
      (row.status?.includes("Hari") || row.status?.includes("OK"))
    )
      return true;
    if (
      selectedStatus === "perluDiganti" &&
      (row.status?.includes("Segera") || row.status?.includes("Perlu"))
    )
      return true;
    if (selectedStatus === "noStatus" && !row.status) return true;
    return false;
  });

  // Sort the data based on status
  const sortedData = [...(statusFilteredData || [])].sort((a, b) => {
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

  // Function to generate and download PDF
  const handleExportToPdf = () => {
    try {
      // Create new jsPDF instance
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text(`Sparepart ${machine} ${machineNumber}`, 14, 22);
      doc.setFontSize(12);
      doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 30);

      // Define the table columns
      const tableColumn = ["Kode", "Part", "Kategori", "Penggantian Terakhir"];

      // Define the table rows
      const tableRows = sortedData.map((row) => [
        row.codePart,
        row.part,
        row.category,
        row.lastReplaced,
        `${row.lifetime} Bulan`,
        calculateDaysUntilNextReplacement(row.nextReplacement).toString(),
        row.status || "Tidak Ada Status",
      ]);

      // Generate the table manually if autoTable is not available
      if (typeof autoTable !== "function") {
        // Fallback to basic table
        let yPos = 40;
        const cellPadding = 5;
        const cellHeight = 10;
        const pageWidth = doc.internal.pageSize.getWidth();
        const colWidths = [20, 40, 25, 30, 20, 20, 30];
        const totalWidth = colWidths.reduce((a, b) => a + b, 0);
        const startX = (pageWidth - totalWidth) / 2;

        // Draw header
        doc.setFillColor(66, 66, 66);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);

        let currentX = startX;
        tableColumn.forEach((col, i) => {
          doc.rect(currentX, yPos, colWidths[i], cellHeight, "F");
          doc.text(
            col,
            currentX + cellPadding,
            yPos + cellHeight - cellPadding
          );
          currentX += colWidths[i];
        });

        // Draw rows
        yPos += cellHeight;
        doc.setTextColor(0, 0, 0);

        tableRows.forEach((row, rowIndex) => {
          // Alternate row coloring
          if (rowIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            currentX = startX;
            row.forEach((cell, i) => {
              doc.rect(currentX, yPos, colWidths[i], cellHeight, "F");
              currentX += colWidths[i];
            });
          }

          currentX = startX;
          row.forEach((cell, i) => {
            doc.text(
              String(cell).substring(0, 15) +
                (String(cell).length > 15 ? "..." : ""),
              currentX + cellPadding,
              yPos + cellHeight - cellPadding
            );
            currentX += colWidths[i];
          });

          yPos += cellHeight;

          // Check if we need a new page
          if (yPos > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            yPos = 20;
          }
        });
      } else {
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          columns: [
            { header: "Kode", dataKey: 0 },
            { header: "Part", dataKey: 1 },
            { header: "Kategori", dataKey: 2 },
            { header: "Penggantian Terakhir", dataKey: 3 },
          ],
        });
      }

      // Save the PDF
      doc.save(
        `sparepart_${machine}_${machineNumber}_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal membuat PDF. Silakan cek console untuk detail error.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-white/30 backdrop-blur z-40" />
      <Modal title="Total Sparepart Terpantau" onClose={onClose}>
        {/* Form Pencarian dan Filter */}
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row gap-2 mb-2">
            <input
              type="text"
              placeholder="Cari part, kode, atau kategori..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="select select-bordered lg:w-60"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as StatusOption)
              }
            >
              <option value="all">Semua Status</option>
              <option value="overdue">Overdue</option>
              <option value="ok">OK</option>
              <option value="perluDiganti">Perlu Diganti</option>
              <option value="noStatus">Tidak Ada Status</option>
            </select>

            <button
              onClick={handleExportToPdf}
              className="btn btn-primary flex items-center gap-2"
            >
              <FaPrint /> Export PDF
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {sortedData.length} data ditemukan
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
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

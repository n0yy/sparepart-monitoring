"use client";

import React, { useState, useEffect } from "react";
import KanbanCard from "./Card";
import { CheckCheck, Cog, ShoppingCart } from "lucide-react";

// Define types for better type safety
interface KanbanItem {
  part: string;
  codePart: string;
  onHand: number;
  reorderMin: number;
  leadTime: number;
  vendor: string;
  status: string;
  quantityNextNeeded?: number;
  forMonth?: number;
  quantityWillBeOrder?: number;

  deadlineOrder?: string;
}

interface ApiResponse {
  data: KanbanItem[];
}

export default function Overview() {
  const [data, setData] = useState<KanbanItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/kanban/internal`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          throw new Error("Invalid data structure received");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const openModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    }
  };

  const totalItems = data?.length ?? 0;
  const availableItems =
    data?.filter(
      (item) => item.status === "✅ Cukup" && (item.quantityNextNeeded ?? 0) > 0
    ).length ?? 0;
  const itemsToOrder =
    data?.filter(
      (item) => item.deadlineOrder && item.deadlineOrder.trim() !== ""
    ).length ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-2">Loading kanban data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="alert alert-error">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-evenly">
      <KanbanCard
        title="Total Sparepart Kanban Internal"
        icon={<Cog size={40} className="text-neutral" />}
        value={totalItems}
        onClick={() => openModal("total_kanban")}
      />

      {/* Modal Kanban Total */}
      <dialog id="total_kanban" className="modal ">
        <div className="modal-box w-full max-w-6xl h-[90%]">
          <h3 className="font-bold text-lg mb-5">
            Total Sparepart Kanban Internal
          </h3>
          <div className="rounded-box border border-base-content/5 bg-base-100 overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Part</th>
                  <th>Kode Part</th>
                  <th>On Hand Inventory</th>
                  <th>Reorder Min</th>
                  <th>Leadtime (day)</th>
                  <th>Vendor</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={`${item.codePart}-${index}`}>
                      <th>{index + 1}</th>
                      <td>{item.part}</td>
                      <td>{item.codePart}</td>
                      <td className="text-right">{item.onHand}</td>
                      <td className="text-right">{item.reorderMin}</td>
                      <td className="text-center">{item.leadTime}</td>
                      <td>{item.vendor}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <KanbanCard
        title="Stok Tersedia Sesuai Kebutuhan"
        icon={<CheckCheck size={40} className="text-neutral" />}
        value={availableItems}
        onClick={() => openModal("stock_tersedia")}
      />
      {/* Modal Kanban Total */}
      <dialog id="stock_tersedia" className="modal">
        <div className="modal-box w-full max-w-6xl">
          <h3 className="font-bold text-lg mb-5">
            Stock Tersedia Sesuai Kebutuhan
          </h3>
          <div className="rounded-box border border-base-content/5 bg-base-100 overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Part</th>
                  <th>Kode Part</th>
                  <th>On Hand Inventory</th>
                  <th>Reorder Min</th>
                  <th>Kebutuhan Selanjutnya</th>
                  <th>Vendor</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data
                    .filter(
                      (item) =>
                        (item.quantityNextNeeded ?? 0) > 0 &&
                        item.status === "✅ Cukup"
                    )
                    .map((item, index) => (
                      <tr key={`${item.codePart}-${index}`}>
                        <th>{index + 1}</th>
                        <td>{item.part}</td>
                        <td>{item.codePart}</td>
                        <td className="text-right">{item.onHand}</td>
                        <td className="text-right">{item.reorderMin}</td>
                        <td className="text-center">
                          {item.quantityNextNeeded}
                        </td>
                        <td>{item.vendor}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <KanbanCard
        title="Sparepart Perlu dipesan Bulan ini"
        icon={<ShoppingCart size={40} className="text-neutral" />}
        value={itemsToOrder}
        onClick={() => openModal("perlu_pesan")}
      />
      {/* Modal Kanban Perlu Pesan  */}
      <dialog id="perlu_pesan" className="modal">
        <div className="modal-box w-full max-w-6xl">
          <h3 className="font-bold text-lg mb-5">
            Sparepart Perlu dipesan Bulan ini
          </h3>
          <div className="rounded-box border border-base-content/5 bg-base-100 overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Part</th>
                  <th>Kode Part</th>
                  <th>Qty</th>
                  <th>Untuk Bulan</th>
                  <th>Vendor</th>
                  <th>Deadline Pemesanan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data
                    .filter((item) => item.status === "❗Segera Pesan❗")
                    .map((item, index) => (
                      <tr key={`${item.codePart}-${index}`}>
                        <th>{index + 1}</th>
                        <td>{item.part}</td>
                        <td>{item.codePart}</td>
                        <td className="text-center">
                          {item.quantityWillBeOrder}
                        </td>
                        <td className="text-right">{item.forMonth}</td>
                        <td>{item.vendor}</td>
                        <td className="text-center">{item.deadlineOrder}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

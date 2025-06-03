"use client";

import { notFound } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { machineConfig } from "@/app/api/config/machines";
import { useMachineData } from "@/hooks/useMachineData";
import Tabs from "@/components/Tabs";
import SparepartStats from "@/components/sparepart/SparepartStats";
import SparepartDistribution from "@/components/sparepart/SparepartDistribution";
import OverdueNotifications from "@/components/sparepart/OverdueNotifications";
import TotalSparepartModal from "@/components/sparepart/modals/TotalSparepartModal";
import Total14Days from "@/components/sparepart/modals/Total14Days";
import { SparepartRow } from "@/utils/CalculationPart";

const machineTabs = {
  ilapak: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  sig: ["5", "6"],
  chimei: ["1", "2", "3A", "4B", "5", "5B", "8A", "9A", "10", "11", "12"],
  jinsung: ["1", "2", "3", "4", "5"],
  unifill: ["A", "B"],
};

export default function MachinePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const machineName = params.machine as string;
  const machine = machineName?.toLowerCase();
  const { data: spreadsheetData, loading } = useMachineData(machineName);
  const [openTotalSparepart, setOpenTotalSparepart] = useState(false);
  const [openSparepart14Days, setOpenSparepart14Days] = useState(false);
  const [overdueDistribution, setOverdueDistribution] = useState([
    {
      name: "",
      count: 0,
    },
  ]);

  if (!machineName || !machineConfig[machine]) {
    return notFound();
  }

  const tabs = machineTabs[machine as keyof typeof machineTabs] || [];
  const machineNumber = searchParams.get("machine") || tabs[0];

  useEffect(() => {
    if (!spreadsheetData?.data) return;

    const overdueData = spreadsheetData.data.filter(
      (item: SparepartRow) =>
        item.status &&
        typeof item.status === "string" &&
        item.status.includes("Melewati")
    );

    const distribution = overdueData.reduce(
      (acc: Record<string, number>, item: SparepartRow) => {
        const machine = item.machine || "Unknown";
        acc[machine] = (acc[machine] || 0) + 1;
        return acc;
      },
      {}
    );

    const chartData = Object.entries(distribution).map(([name, count]) => ({
      name,
      count: count as number,
    }));

    setOverdueDistribution(
      chartData.length > 0 ? chartData : [{ name: "", count: 0 }]
    );
  }, [spreadsheetData]);

  // Handle loading state
  if (loading) {
    return (
      <section className="flex items-center justify-center h-screen">
        <p>Loading data...</p>
      </section>
    );
  }

  // Handle case when data is not available
  if (!spreadsheetData) {
    return (
      <section className="flex items-center justify-center h-screen">
        <p>Data tidak tersedia. Silakan coba lagi nanti.</p>
      </section>
    );
  }

  console.log(spreadsheetData?.data);

  return (
    <section className="flex items-center flex-col p-10">
      {/* Tabs */}
      {tabs.length > 0 && (
        <Tabs
          tabs={tabs}
          basePath={`/dashboard/lifetime/${machine}`}
          labelPrefix={machine.toUpperCase()}
        />
      )}

      {/* Summary Stats */}
      <SparepartStats
        machine={machine}
        machineNumber={machineNumber}
        spreadsheetData={spreadsheetData}
        onOpenTotalSparepart={() => setOpenTotalSparepart(true)}
        onOpenSparepart14Days={() => setOpenSparepart14Days(true)}
      />

      {/* Total Sparepart Modal */}
      {openTotalSparepart && (
        <TotalSparepartModal
          machine={machine}
          machineNumber={machineNumber}
          spreadsheetData={spreadsheetData}
          onClose={() => setOpenTotalSparepart(false)}
        />
      )}

      {/* Total 14 Hari lagi yang harus diganti */}
      {openSparepart14Days && (
        <Total14Days
          machine={machine}
          machineNumber={machineNumber}
          spreadsheetData={spreadsheetData}
          onClose={() => setOpenSparepart14Days(false)}
        />
      )}

      {/* Visualization Section */}
      <section className="mt-10">
        {/* Overdue Distribution  */}
        {/* <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={overdueDistribution}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              fill="#e74c3c"
              name="Distribusi Overdue"
              activeBar={<Rectangle fill="#c0392b" stroke="#7f0000" />}
            />
          </BarChart>
        </ResponsiveContainer> */}
        <div className="flex items-center justify-center">
          <SparepartDistribution
            machine={machine}
            machineNumber={machineNumber}
            spreadsheetData={spreadsheetData}
          />

          <OverdueNotifications
            machine={machine}
            machineNumber={machineNumber}
            spreadsheetData={spreadsheetData}
          />
        </div>
      </section>
    </section>
  );
}

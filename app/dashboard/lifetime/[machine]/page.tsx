"use client";

import { notFound } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { machineConfig } from "@/app/api/config/machines";
import { useMachineData } from "@/hooks/useMachineData";
import Tabs from "@/components/Tabs";
import SparepartStats from "@/components/sparepart/SparepartStats";
import SparepartDistribution from "@/components/sparepart/SparepartDistribution";
import OverdueNotifications from "@/components/sparepart/OverdueNotifications";
import TotalSparepartModal from "@/components/sparepart/modals/TotalSparepartModal";
import Total14Days from "@/components/sparepart/modals/Total14Days";

const machineTabs = {
  ilapak: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  sig: ["5", "6"],
  chimei: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  jinsung: ["1", "2", "3", "4", "5"],
  unifill: ["A", "B"],
};

export default function MachinePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const machineName = params.machine as string;
  const machine = machineName?.toLowerCase();
  const { data: spreadsheetData } = useMachineData(machineName);
  const [openTotalSparepart, setOpenTotalSparepart] = useState(false);
  const [openSparepart14Days, setOpenSparepart14Days] = useState(false);

  if (!machineName || !machineConfig[machine]) {
    return notFound();
  }

  const tabs = machineTabs[machine as keyof typeof machineTabs] || ["1"];
  const machineNumber = searchParams.get("machine") || tabs[0];

  return (
    <section className="flex items-center flex-col p-10">
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        basePath={`/dashboard/lifetime/${machine}`}
        labelPrefix={machine.toUpperCase()}
      />

      {/* Summary Stats */}
      <SparepartStats
        machine={machine}
        machineNumber={machineNumber}
        spreadsheetData={spreadsheetData!}
        onOpenTotalSparepart={() => setOpenTotalSparepart(true)}
        onOpenSparepart14Days={() => setOpenSparepart14Days(true)}
      />

      {/* Total Sparepart Modal */}
      {openTotalSparepart && (
        <TotalSparepartModal
          machine={machine}
          machineNumber={machineNumber}
          spreadsheetData={spreadsheetData!}
          onClose={() => setOpenTotalSparepart(false)}
        />
      )}

      {/* Total 14 Hari lagi yang harus diganti */}
      {openSparepart14Days && (
        <Total14Days
          machine={machine}
          machineNumber={machineNumber}
          spreadsheetData={spreadsheetData!}
          onClose={() => setOpenSparepart14Days(false)}
        />
      )}

      {/* Visualization Section */}
      <section className="flex justify-between mt-10">
        <SparepartDistribution
          machine={machine}
          machineNumber={machineNumber}
          spreadsheetData={spreadsheetData!}
        />

        <OverdueNotifications
          machine={machine}
          machineNumber={machineNumber}
          spreadsheetData={spreadsheetData!}
        />
      </section>
    </section>
  );
}

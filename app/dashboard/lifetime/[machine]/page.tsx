"use client";

import Tabs from "@/components/Tabs";
import MachineDataTable from "@/components/MachineDataTable";
import MachineSummary from "@/components/MachineSummary";
import { machineConfig } from "@/app/api/config/machines";
import { notFound } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";

// Machine-specific tab configurations
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

  // Check if the machine exists in our config
  if (!machineName || !machineConfig[machineName.toLowerCase()]) {
    return notFound();
  }

  const machine = machineName.toLowerCase();
  const tabs = machineTabs[machine as keyof typeof machineTabs] || ["1"];
  const machineNumber = searchParams.get("tab") || tabs[0];

  return (
    <section className="flex items-center flex-col p-10">
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        basePath={`/lifetime/${machine}`}
        labelPrefix={machine.toUpperCase()}
      />
      {/* Summary */}
      <div className="w-full max-w-4xl mt-8">
        <MachineSummary machineName={machine} />
      </div>
      {/* Data Table */}
      <div className="w-full max-w-4xl mt-8">
        <MachineDataTable machineName={machine} machineNumber={machineNumber} />
      </div>
    </section>
  );
}

"use client";

import Tabs from "@/components/Tabs";
import MachineDataTable from "@/components/MachineDataTable";
export default function Sig() {
  const tabs = ["5", "6"];
  return (
    <section className="flex items-center flex-col">
      {/* Tabs */}
      <Tabs tabs={tabs} basePath="/lifetime/sig" labelPrefix="SIG" />
      <MachineDataTable machineName="sig" />
    </section>
  );
}

"use client";

import Tabs from "@/components/Tabs";
import MachineDataTable from "@/components/MachineDataTable";

export default function Ilapak() {
  const tabs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  return (
    <section className="flex items-center flex-col">
      {/* Tabs */}
      <Tabs tabs={tabs} basePath="/lifetime/ilapak" labelPrefix="Ilapak" />
      <MachineDataTable machineName="ilapak" />
    </section>
  );
}

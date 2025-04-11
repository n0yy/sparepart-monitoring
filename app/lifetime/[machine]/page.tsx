"use client";

import Tabs from "@/components/Tabs";
import MachineDataTable from "@/components/MachineDataTable";
import { machineConfig } from "@/app/api/config/machines";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

const machineTabs = {
  ilapak: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  sig: ["5", "6"],
  chimei: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  jinsung: ["1", "2", "3", "4", "5"],
  unifil: ["A", "B"],
};

export default function MachinePage() {
  const params = useParams();
  const machine = params.machine as string;

  if (!machine || !machineConfig[machine.toLowerCase()]) {
    return notFound();
  }

  const machineName = machine.toLowerCase();
  const tabs = machineTabs[machineName as keyof typeof machineTabs];

  return (
    <section>
      <Tabs
        tabs={tabs}
        basePath={`/lifetime/${machineName}`}
        labelPrefix={`${machineName.toUpperCase()}`}
      />
      <MachineDataTable machineName={machineName} />
    </section>
  );
}

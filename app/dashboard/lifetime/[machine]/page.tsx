"use client";

import Tabs from "@/components/Tabs";
import SparepartStatus from "@/components/SparepartStatus";
import { machineConfig } from "@/app/api/config/machines";
import { notFound } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { useMachineData } from "@/hooks/useMachineData";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { RiHourglass2Fill } from "react-icons/ri";
import { FaGear } from "react-icons/fa6";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface SparepartRow {
  machine: string;
  codePart: string;
  part: string;
  quantity: string;
  category: string;
  lastReplaced: string;
  lifetime: string;
  nextReplacement: string;
  status: string;
}

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
  const { data: spreadsheetData } = useMachineData(machineName);

  // Check if the machine exists in our config
  if (!machineName || !machineConfig[machineName.toLowerCase()]) {
    return notFound();
  }

  const machine = machineName.toLowerCase();
  const tabs = machineTabs[machine as keyof typeof machineTabs] || ["1"];
  const machineNumber = searchParams.get("machine") || tabs[0];
  console.log("From Dashboard Lifetime : ", machineNumber);
  // Total Sparepart
  const totalSparepart = (spreadsheetData: {
    data?: SparepartRow[];
  }): number => {
    return (
      spreadsheetData?.data?.filter((row: SparepartRow) => {
        if (
          !("lastReplaced" in row) ||
          !("lifetime" in row) ||
          row.machine !== `${machine.toUpperCase()} ${machineNumber}`
        ) {
          return false;
        }
        return true;
      }).length || 0
    );
  };

  // Sparepart Akan Habis Umur (<14 hari)
  const sparepartWillExpire = (spreadsheetData: {
    data?: SparepartRow[];
  }): number => {
    const today = new Date();
    return (
      spreadsheetData?.data?.filter((row: SparepartRow) => {
        if (
          !("lastReplaced" in row) ||
          !("lifetime" in row) ||
          row.machine !== `${machine.toUpperCase()} ${machineNumber}`
        )
          return false;

        const nextReplacementDate = new Date(row.nextReplacement);
        const timeDiff = nextReplacementDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff <= 14;
      }).length || 0
    );
  };

  // Sparepart Overdue
  const sparepartOverdue = (spreadsheetData: {
    data?: SparepartRow[];
  }): number => {
    return (
      spreadsheetData?.data?.filter((row: SparepartRow) => {
        if (
          !("lastReplaced" in row) ||
          !("lifetime" in row) ||
          row.machine !== `${machine.toUpperCase()} ${machineNumber}`
        )
          return false;
        return row.status === "Melewati Jadwal Penggantian";
      }).length || 0
    );
  };

  // Sparepart OK
  const sparepartOK = (spreadsheetData: { data?: SparepartRow[] }): number => {
    return (
      spreadsheetData?.data?.filter((row: SparepartRow) => {
        if (
          !("lastReplaced" in row) ||
          !("lifetime" in row) ||
          !("status" in row) ||
          row.machine !== `${machine.toUpperCase()} ${machineNumber}`
        ) {
          return false;
        }
        return row.status.includes("Hari Lagi");
      }).length || 0
    );
  };

  return (
    <section className="flex items-center flex-col p-10">
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        basePath={`/dashboard/lifetime/${machine}`}
        labelPrefix={machine.toUpperCase()}
      />
      {/* Summary */}
      <div className="w-full flex flex-wrap items-center justify-center mt-8 gap-4">
        {/* Total Sparepart */}
        <SparepartStatus
          title="Total Sparepart Terpantau"
          machineName={machine}
          machineNumber={machineNumber}
          calcFunc={totalSparepart}
          icon={<FaGear size={40} className="text-neutral" />}
        />
        {/* Sparepart Akan Habis Umur (<14 hari) */}
        <SparepartStatus
          title="Sparepart Akan Habis Umur"
          subtitle="(<14 hari)"
          machineName={machine}
          machineNumber={machineNumber}
          calcFunc={sparepartWillExpire}
          icon={<RiHourglass2Fill size={40} />}
        />
        <SparepartStatus
          title="Sparepart Overdue"
          machineName={machine}
          machineNumber={machineNumber}
          calcFunc={sparepartOverdue}
          icon={<FaExclamationTriangle size={32} />}
        />
        <SparepartStatus
          title="Sparepart Aktif (OK)"
          machineName={machine}
          machineNumber={machineNumber}
          calcFunc={sparepartOK}
          icon={<FaCheckCircle size={32} />}
        />
      </div>
      {/* Visualization */}
      <section className="flex justify-between mt-10">
        <div className="w-full h-full flex flex-col items-center scale-[80%]">
          <h2 className="text-4xl font-bold mb-4 text-neutral">
            Distribusi Status Sparepart
          </h2>
          <PieChart width={500} height={400}>
            <Pie
              dataKey="value"
              data={[
                {
                  name: "Overdue",
                  value: spreadsheetData
                    ? (sparepartOverdue(spreadsheetData) /
                        totalSparepart(spreadsheetData)) *
                      100
                    : 0,
                  fill: "#6CE5E8",
                },
                {
                  name: "OK",
                  value: spreadsheetData
                    ? (sparepartOK(spreadsheetData) /
                        totalSparepart(spreadsheetData)) *
                      100
                    : 0,
                  fill: "#2D8BBA",
                },
                {
                  name: "Perlu Diganti",
                  value: spreadsheetData
                    ? (sparepartWillExpire(spreadsheetData) /
                        totalSparepart(spreadsheetData)) *
                      100
                    : 0,
                  fill: "#2F5F98",
                },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={150}
              isAnimationActive={false}
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </section>
    </section>
  );
}

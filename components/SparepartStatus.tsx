"use client";

import { useMachineData } from "@/hooks/useMachineData";
import { useParams } from "next/navigation";

interface MachineSummaryProps {
  title: string;
  machineName: string;
  machineNumber: string;
  calcFunc: (spreadsheetData: any) => number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function SparepartStatus({
  title,
  machineName,
  machineNumber,
  subtitle,
  calcFunc,
  icon,
}: MachineSummaryProps) {
  const { data: spreadsheetData, loading, error } = useMachineData(machineName);
  const params = useParams();
  const machine = params.machine as string;

  if (loading)
    return (
      <div className="w-[260px] h-[180px] rounded-2xl bg-[#E0E5EC] shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] animate-pulse" />
    );

  if (error)
    return (
      <div className="w-[260px] h-[180px] rounded-2xl bg-[#E0E5EC] shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] p-4">
        <p className="text-error text-sm">Error: {error}</p>
      </div>
    );

  return (
    <div className="w-[260px] h-[180px] rounded-2xl bg-[#E0E5EC] shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:shadow-[12px_12px_24px_#a3b1c6,-12px_-12px_24px_#ffffff]">
      <div className="p-6 h-full flex flex-col justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-[#4D4D4D]">
              {title}
            </span>
            {icon && <div className="text-[#4D4D4D] opacity-70">{icon}</div>}
          </div>
          {subtitle && (
            <p className="text-sm text-[#4D4D4D] opacity-60">{subtitle}</p>
          )}
        </div>

        <div className="flex items-end space-x-2">
          <span className="text-5xl font-bold text-[#4D4D4D]">
            {calcFunc(spreadsheetData)}
          </span>
          <span className="text-sm text-[#4D4D4D] opacity-60 mb-1">Part</span>
        </div>
      </div>
    </div>
  );
}

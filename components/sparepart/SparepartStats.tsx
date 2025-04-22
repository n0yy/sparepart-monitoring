// file: app/dashboard/lifetime/[machine]/components/SparepartStats.tsx
import { RiHourglass2Fill } from "react-icons/ri";
import { FaGear } from "react-icons/fa6";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import SparepartStatus from "@/components/sparepart/SparepartStatus";
import { MachineProps } from "@/utils/CalculationPart";
import {
  totalSparepart,
  sparepartWillExpire,
  sparepartOverdue,
  sparepartOK,
} from "@/utils/CalculationPart";

interface SparepartStatsProps extends MachineProps {
  onOpenTotalSparepart: () => void;
}

export default function SparepartStats({
  machine,
  machineNumber,
  spreadsheetData,
  onOpenTotalSparepart,
}: SparepartStatsProps) {
  return (
    <div className="w-full flex flex-wrap items-center justify-center mt-8 gap-4">
      {/* Total Sparepart */}
      <div
        className="hover:cursor-pointer hover:scale-105 transition-all duration-300"
        onClick={onOpenTotalSparepart}
      >
        <SparepartStatus
          title="Total Sparepart Terpantau"
          machineName={machine}
          machineNumber={machineNumber}
          calcFunc={(data) => totalSparepart(data, machine, machineNumber)}
          icon={<FaGear size={40} className="text-neutral" />}
        />
      </div>

      {/* Sparepart Akan Habis Umur (<14 hari) */}
      <SparepartStatus
        title="Sparepart Akan Habis Umur"
        subtitle="(<14 hari)"
        machineName={machine}
        machineNumber={machineNumber}
        calcFunc={(data) => sparepartWillExpire(data, machine, machineNumber)}
        icon={<RiHourglass2Fill size={40} />}
      />

      {/* Sparepart Overdue */}
      <SparepartStatus
        title="Sparepart Overdue"
        machineName={machine}
        machineNumber={machineNumber}
        calcFunc={(data) => sparepartOverdue(data, machine, machineNumber)}
        icon={<FaExclamationTriangle size={32} />}
      />

      {/* Sparepart OK */}
      <SparepartStatus
        title="Sparepart Aktif (OK)"
        machineName={machine}
        machineNumber={machineNumber}
        calcFunc={(data) => sparepartOK(data, machine, machineNumber)}
        icon={<FaCheckCircle size={32} />}
      />
    </div>
  );
}

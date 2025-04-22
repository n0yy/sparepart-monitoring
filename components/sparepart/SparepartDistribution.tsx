// file: app/dashboard/lifetime/[machine]/components/SparepartDistribution.tsx
import { PieChart, Pie, Legend, Tooltip } from "recharts";
import { MachineProps } from "@/utils/CalculationPart";
import {
  totalSparepart,
  sparepartWillExpire,
  sparepartOverdue,
  sparepartOK,
} from "@/utils/CalculationPart";

export default function SparepartDistribution({
  machine,
  machineNumber,
  spreadsheetData,
}: MachineProps) {
  // Prepare chart data
  const total = totalSparepart(spreadsheetData, machine, machineNumber);
  const overdueCount = sparepartOverdue(
    spreadsheetData,
    machine,
    machineNumber
  );
  const okCount = sparepartOK(spreadsheetData, machine, machineNumber);
  const willExpireCount = sparepartWillExpire(
    spreadsheetData,
    machine,
    machineNumber
  );

  const chartData = [
    {
      name: "Overdue",
      value: total ? (overdueCount / total) * 100 : 0,
      fill: "#6CE5E8",
    },
    {
      name: "OK",
      value: total ? (okCount / total) * 100 : 0,
      fill: "#2D8BBA",
    },
    {
      name: "Perlu Diganti",
      value: total ? (willExpireCount / total) * 100 : 0,
      fill: "#2F5F98",
    },
  ];

  return (
    <div className="w-[550px] h-[600px] flex flex-col items-center scale-[80%] rounded-2xl bg-[#E0E5EC] shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:shadow-[12px_12px_24px_#a3b1c6,-12px_-12px_24px_#ffffff] p-10">
      <h2 className="text-4xl font-bold mb-4 text-neutral">
        Distribusi Status Sparepart
      </h2>
      <PieChart width={500} height={400}>
        <Pie
          dataKey="value"
          data={chartData}
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
  );
}

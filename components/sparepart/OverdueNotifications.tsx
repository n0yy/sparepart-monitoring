// file: app/dashboard/lifetime/[machine]/components/OverdueNotifications.tsx
import { MachineProps } from "@/utils/CalculationPart";
import { getOverdueSpareParts } from "@/utils/CalculationPart";

export default function OverdueNotifications({
  machine,
  machineNumber,
  spreadsheetData,
}: MachineProps) {
  const overdueItems = getOverdueSpareParts(
    spreadsheetData?.data,
    machine,
    machineNumber
  );

  return (
    <div className="w-[550px] h-[600px] flex flex-col items-start scale-[80%] rounded-2xl bg-[#E0E5EC] shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:shadow-[12px_12px_24px_#a3b1c6,-12px_-12px_24px_#ffffff] p-10">
      <h2 className="text-4xl font-bold mb-7 text-neutral">
        Overdue Sparepart Notification
      </h2>
      <div className="flex flex-col items-start">
        {overdueItems?.map((row) => (
          <div key={row.codePart} className="flex items-center mb-4 space-x-4">
            <span className="w-4 h-4 bg-red-500/70 rounded-full"></span>
            <span className="text-lg font-semibold text-gray-600">
              {row.part}
            </span>
          </div>
        ))}
        {overdueItems?.length === 0 && (
          <div className="text-lg text-gray-500">
            Tidak ada sparepart yang melewati jadwal penggantian
          </div>
        )}
      </div>
    </div>
  );
}

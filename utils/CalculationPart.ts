export interface SparepartRow {
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

export interface SpreadsheetData {
  data?: SparepartRow[];
}

export interface MachineProps {
  machine: string;
  machineNumber: string;
  spreadsheetData: SpreadsheetData;
}

export const calculateDaysUntilNextReplacement = (
  nextReplacement: string | undefined,
  justNumber = false
) => {
  if (!nextReplacement) {
    return "Belum terjadwal";
  }

  try {
    const [day, month, year] = nextReplacement.split("/");

    if (!day || !month || !year) {
      return "Format tanggal tidak valid";
    }

    const nextReplacementDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    if (isNaN(nextReplacementDate.getTime())) {
      return "Tanggal tidak valid";
    }

    const today = new Date();
    const timeDiff = nextReplacementDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0 && !justNumber) {
      return "Sudah lewat jadwal";
    }
    if (justNumber) {
      return daysDiff;
    } else {
      return `${daysDiff} hari lagi`;
    }
  } catch (error) {
    console.error("Error calculating days until replacement:", error);
    return "Error perhitungan tanggal";
  }
};

export const totalSparepart = (
  spreadsheetData: SpreadsheetData,
  machine: string,
  machineNumber: string
): number => {
  return (
    spreadsheetData?.data?.filter((row: SparepartRow) => {
      if (row.machine !== `${machine.toUpperCase()} ${machineNumber}`) {
        return false;
      }
      return true;
    }).length || 0
  );
};

// Sparepart Akan Habis Umur (<14 hari)
export const sparepartWillExpire = (
  spreadsheetData: SpreadsheetData,
  machine: string,
  machineNumber: string
): number => {
  return (
    spreadsheetData?.data?.filter((row: SparepartRow) => {
      if (row.machine !== `${machine.toUpperCase()} ${machineNumber}`)
        return false;

      const days = calculateDaysUntilNextReplacement(row.nextReplacement, true);
      return Number(days) <= 14 && Number(days) > 0;
    }).length || 0
  );
};

// Sparepart Overdue
export const sparepartOverdue = (
  spreadsheetData: SpreadsheetData,
  machine: string,
  machineNumber: string
): number => {
  return (
    spreadsheetData?.data?.filter((row: SparepartRow) => {
      if (row.machine !== `${machine.toUpperCase()} ${machineNumber}`)
        return false;
      return row.status === "Melewati Jadwal Penggantian";
    }).length || 0
  );
};

// Sparepart OK
export const sparepartOK = (
  spreadsheetData: SpreadsheetData,
  machine: string,
  machineNumber: string
): number => {
  return (
    spreadsheetData?.data?.filter((row: SparepartRow) => {
      if (
        !("status" in row) ||
        row.machine !== `${machine.toUpperCase()} ${machineNumber}`
      ) {
        return false;
      }
      return row.status.includes("Hari Lagi");
    }).length || 0
  );
};

export function filterSparepartsByMachine(
  data: SparepartRow[] | undefined,
  machine: string,
  machineNumber: number,
  searchQuery: string
): SparepartRow[] {
  if (!data) return [];

  const formattedMachine = `${machine.toUpperCase()} ${machineNumber}`;

  return data.filter((row) => {
    const matchesMachine = row.machine?.toUpperCase() === formattedMachine;
    const matchesSearch = ["part", "codePart", "category"].some((field) =>
      (row as { [key: string]: any })[field]
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    return matchesMachine && matchesSearch;
  });
}

export const getOverdueSpareParts = (
  data: SparepartRow[] | undefined,
  machine: string,
  machineNumber: string,
  limit: number = 5
) => {
  return data
    ?.filter((row: SparepartRow) => {
      if (row.machine !== `${machine.toUpperCase()} ${machineNumber}`)
        return false;
      return row.status === "Melewati Jadwal Penggantian";
    })
    ?.sort((a: SparepartRow, b: SparepartRow) => {
      const dateA = new Date(a.nextReplacement);
      const dateB = new Date(b.nextReplacement);
      return dateA.getTime() - dateB.getTime();
    })
    ?.slice(0, limit);
};

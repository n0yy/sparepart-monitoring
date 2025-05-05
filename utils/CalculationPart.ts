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
export const sparepartWillExpire = (
  spreadsheetData: SpreadsheetData,
  machine: string,
  machineNumber: string
): number => {
  return (
    spreadsheetData?.data?.filter((row: SparepartRow) => {
      if (
        !("lastReplaced" in row) ||
        !("lifetime" in row) ||
        row.machine !== `${machine.toUpperCase()} ${machineNumber}`
      )
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
export const sparepartOK = (
  spreadsheetData: SpreadsheetData,
  machine: string,
  machineNumber: string
): number => {
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

export const filterSparepartsByMachine = (
  data: SparepartRow[] | undefined,
  machine: string,
  machineNumber: string,
  searchQuery: string = ""
) => {
  return data?.filter((row: SparepartRow) => {
    // Filter berdasarkan mesin
    if (
      !("lastReplaced" in row) ||
      !("lifetime" in row) ||
      row.machine !== `${machine.toUpperCase()} ${machineNumber}`
    )
      return false;

    // Filter berdasarkan pencarian
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        row.codePart.toLowerCase().includes(query) ||
        row.part.toLowerCase().includes(query) ||
        row.category.toLowerCase().includes(query)
      );
    }

    return true;
  });
};

export const getOverdueSpareParts = (
  data: SparepartRow[] | undefined,
  machine: string,
  machineNumber: string,
  limit: number = 5
) => {
  return data
    ?.filter((row: SparepartRow) => {
      if (
        !("lastReplaced" in row) ||
        !("lifetime" in row) ||
        row.machine !== `${machine.toUpperCase()} ${machineNumber}`
      )
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

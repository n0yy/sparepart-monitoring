import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { memoryCache } from "./cache";

export async function fetchSheetData(
  worksheetName: string
): Promise<{ title: string; data: any[] }> {
  // Cek apakah data ada di cache
  const cacheKey = `sheet_data_${worksheetName}`;
  const cachedData = memoryCache.get<{ title: string; data: any[] }>(cacheKey);

  if (cachedData) {
    console.log(`Using cached data for ${worksheetName}`);
    return cachedData;
  }

  try {
    console.log(`Fetching fresh data for ${worksheetName}`);
    const doc = new GoogleSpreadsheet(
      process.env.SHEET_ID!,
      new JWT({
        email: process.env.CLIENT_EMAIL!,
        key: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })
    );

    try {
      await doc.loadInfo();
    } catch (error) {
      throw new Error(
        `Failed to load spreadsheet with ID ${process.env.SHEET_ID}: ${
          (error as Error).message
        }`
      );
    }

    const sheet = doc.sheetsByTitle[worksheetName];
    if (!sheet) {
      throw new Error(`Worksheet "${worksheetName}" not found in spreadsheet`);
    }

    await sheet.loadHeaderRow(2); // Header ada di baris ke-2
    const rows = await sheet.getRows();
    let data = [];

    if (worksheetName !== "KANBAN") {
      data = rows.map((row: GoogleSpreadsheetRow) => ({
        machine: row.get("Mesin"),
        codePart: row.get("Kode Part"),
        part: row.get("Part"),
        quantity: row.get("Qty"),
        category: row.get("Category"),
        lastReplaced: row.get("Penggantian Terakhir"),
        lifetime: row.get("Lifetime (Bulan)"),
        nextReplacement: row.get("Penggantian Selanjutnya"),
        status: row.get("STATUS"),
      }));
    } else {
      data = rows.map((row: GoogleSpreadsheetRow) => ({
        part: row.get("Part"),
        codePart: row.get("Kode Part"),
        onHand: row.get("On Hand Inventory"),
        reorderMin: row.get("Reorder Min"),
        leadTime: row.get("Leadtime (Hari)"),
        vendor: row.get("Supplier"),
        status: row.get("Status"),
        deadlineOrder: row.get("Deadline Pemesanan"),
        forMonth: row.get("Untuk Bulan"),
        quantityWillBeOrder: row.get("Qty yang dipesan"),
        quantityNextNeeded: row.get("Qty Kebutuhan Selanjutnya"),
      }));
    }

    const result = { title: doc.title, data };

    // Simpan hasil di cache selama 15 menit
    memoryCache.set(cacheKey, result);

    return result;
  } catch (error) {
    throw new Error(
      `Error fetching data from worksheet "${worksheetName}": ${
        (error as Error).message
      }`
    );
  }
}

import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function fetchSheetData(
  worksheetName: string
): Promise<{ title: string; data: any[] }> {
  try {
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

    const data = rows.map((row: GoogleSpreadsheetRow) => ({
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

    return { title: doc.title, data };
  } catch (error) {
    throw new Error(
      `Error fetching data from worksheet "${worksheetName}": ${
        (error as Error).message
      }`
    );
  }
}

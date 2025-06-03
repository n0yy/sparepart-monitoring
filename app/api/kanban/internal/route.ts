import { NextResponse } from "next/server";
import { fetchSheetData } from "../../lib/googleSheets";

export async function GET() {
  const result = await fetchSheetData("KANBAN");
  return NextResponse.json(result, {
    status: 200,
  });
}

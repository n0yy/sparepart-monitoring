import { NextResponse } from "next/server";
import { machineConfig } from "../../config/machines";
import { fetchSheetData } from "../../lib/googleSheets";

export const revalidate = 3600;

export async function GET(
  request: Request,
  context: { params: Promise<{ machine: string }> } // Update the type to reflect that params is a Promise
) {
  const params = await context.params; // Await the params
  const { machine } = params; // Now you can safely destructure

  // Validasi mesin
  if (!machineConfig[machine.toLowerCase()]) {
    return NextResponse.json(
      { error: `Machine "${machine}" not found` },
      { status: 404 }
    );
  }

  try {
    const { worksheetName } = machineConfig[machine.toLowerCase()];
    const result = await fetchSheetData(worksheetName);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, state-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error(`Error fetching data for ${machine}:`, error);
    return NextResponse.json(
      { error: (error as Error).message || "Error fetching data" },
      { status: 500 }
    );
  }
}

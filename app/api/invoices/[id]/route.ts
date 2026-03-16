import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "registrations.json");

function readRegistrations(): Array<Record<string, unknown>> {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const registrations = readRegistrations();
  const invoice = registrations.find((r) => r.invoiceNumber === id);

  if (!invoice) {
    return NextResponse.json(
      { success: false, error: "Invoice tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, invoice });
}

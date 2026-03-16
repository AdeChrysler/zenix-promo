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

function writeRegistrations(data: Array<Record<string, unknown>>): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      // Handle form-urlencoded
      const text = await request.text();
      const params = new URLSearchParams(text);
      body = Object.fromEntries(params.entries());
    }

    const trxId = String(body.trx_id || body.TransactionId || "");
    const statusCode = String(body.status_code || body.StatusCode || "");
    const referenceId = String(body.reference_id || body.ReferenceId || "");
    const status = String(body.status || body.Status || "");

    console.log("[iPaymu Webhook]", { trxId, statusCode, referenceId, status });

    if (!referenceId) {
      return NextResponse.json({ message: "No reference ID" }, { status: 400 });
    }

    // Status code 1 = success in iPaymu
    const isPaid = statusCode === "1" || status === "berhasil" || status === "success";

    if (isPaid) {
      const registrations = readRegistrations();
      const reg = registrations.find((r) => r.invoiceNumber === referenceId);
      if (reg) {
        reg.status = "paid";
        reg.paidAt = new Date().toISOString();
        reg.paymentTransactionId = trxId;
        writeRegistrations(registrations);
        console.log(`[iPaymu Webhook] Marked ${referenceId} as paid`);
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("[iPaymu Webhook] Error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

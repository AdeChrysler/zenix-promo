import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createPayment } from "@/app/lib/ipaymu";

const DATA_PATH = path.join(process.cwd(), "data", "registrations.json");
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://promo.zenova.id";

function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `INV-${y}${m}${d}-${rand}`;
}

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
    const body = await request.json();
    const { name, email, phone, paymentOption, paymentMethod, paymentChannel } = body;

    if (!name || !email || !phone || !paymentOption) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (paymentOption !== "full" && paymentOption !== "installment") {
      return NextResponse.json(
        { success: false, error: "Opsi pembayaran tidak valid." },
        { status: 400 }
      );
    }

    const validMethods = ["qris", "va"];
    const validChannels = ["qris", "bni", "bca", "mandiri"];
    const method = validMethods.includes(paymentMethod) ? paymentMethod : "qris";
    const channel = validChannels.includes(paymentChannel) ? paymentChannel : "qris";

    const invoiceNumber = generateInvoiceNumber();
    const amount = paymentOption === "full" ? 4500000 : 2250000;
    const createdAt = new Date().toISOString();
    const phoneFormatted = phone.startsWith("+62") ? phone : `+62${phone}`;

    // Create iPaymu payment
    let paymentData;
    try {
      paymentData = await createPayment({
        referenceId: invoiceNumber,
        amount,
        productName: "Zenix.id Lifetime Access",
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phoneFormatted,
        paymentMethod: method,
        paymentChannel: channel,
        notifyUrl: `${APP_URL}/api/webhook/ipaymu`,
        returnUrl: `${APP_URL}/invoice/${invoiceNumber}`,
      });
    } catch (err) {
      console.error("[Register] iPaymu error:", err);
      // Save registration even if payment creation fails
      paymentData = null;
    }

    const registration: Record<string, unknown> = {
      invoiceNumber,
      name,
      email,
      phone: phoneFormatted,
      paymentOption,
      paymentMethod: method,
      paymentChannel: channel,
      amount,
      totalAmount: 4500000,
      status: "pending",
      createdAt,
    };

    if (paymentData) {
      registration.transactionId = paymentData.transactionId;
      registration.paymentNo = paymentData.paymentNo;
      registration.paymentName = paymentData.paymentName;
      registration.paymentExpired = paymentData.expired;
      registration.qrisUrl = paymentData.qrisUrl;
      registration.qrString = paymentData.qrString;
      registration.paymentTotal = paymentData.total;
    }

    const registrations = readRegistrations();
    registrations.push(registration);
    writeRegistrations(registrations);

    return NextResponse.json({
      success: true,
      invoiceNumber,
      name,
      email,
      phone: phoneFormatted,
      paymentOption,
      paymentMethod: method,
      paymentChannel: channel,
      amount,
      redirectUrl: `/invoice/${invoiceNumber}`,
      payment: paymentData || null,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

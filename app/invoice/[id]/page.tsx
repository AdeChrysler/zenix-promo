"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface InvoiceData {
  invoiceNumber: string;
  name: string;
  email: string;
  phone: string;
  paymentOption: "full" | "installment";
  amount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

function formatCurrency(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getDueDate(iso: string): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + 30);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInvoice(data.invoice as InvoiceData);
        } else {
          setError(data.error || "Invoice tidak ditemukan.");
        }
      })
      .catch(() => setError("Gagal memuat invoice."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Memuat invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-400">{error}</p>
          <a href="/" className="text-[#4a7dff] hover:underline">
            Kembali ke halaman utama
          </a>
        </div>
      </div>
    );
  }

  const waMessage = encodeURIComponent(
    `Konfirmasi pembayaran ${invoice.invoiceNumber}`
  );
  const waLink = `https://wa.me/6281234567890?text=${waMessage}`;

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-white/[0.06] bg-[#111118] p-8 print:border-gray-300 print:bg-white print:text-black">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">INVOICE</h1>
          </div>

          {/* Invoice Details */}
          <div className="mb-6 space-y-1 text-sm">
            <p>
              <span className="text-gray-400 print:text-gray-600">
                Invoice #:
              </span>{" "}
              <span className="font-semibold">{invoice.invoiceNumber}</span>
            </p>
            <p>
              <span className="text-gray-400 print:text-gray-600">
                Tanggal:
              </span>{" "}
              {formatDate(invoice.createdAt)}
            </p>
          </div>

          {/* Customer Info */}
          <div className="mb-6 space-y-1 text-sm">
            <p className="font-semibold text-gray-400 print:text-gray-600">
              Kepada:
            </p>
            <p>Nama: {invoice.name}</p>
            <p>Email: {invoice.email}</p>
            <p>WhatsApp: {invoice.phone}</p>
          </div>

          {/* Line Items */}
          <div className="mb-6 border-t border-b border-white/[0.06] py-4 print:border-gray-300">
            <div className="mb-3 flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 print:text-gray-600">
              <span>Item</span>
              <span>Jumlah</span>
            </div>

            {invoice.paymentOption === "full" ? (
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">Zenix.id Lifetime Access</p>
                  <p className="text-xs text-gray-400 print:text-gray-500">
                    Full Payment
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(4500000)}</p>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-2 font-medium">Zenix.id Lifetime Access</p>
                  <div className="flex justify-between">
                    <p className="text-gray-300 print:text-gray-700">
                      Cicilan 1/2
                    </p>
                    <p className="font-semibold">{formatCurrency(2250000)}</p>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <p className="text-gray-300 print:text-gray-700">
                      Cicilan 2/2{" "}
                      <span className="text-xs text-gray-400 print:text-gray-500">
                        (jatuh tempo {getDueDate(invoice.createdAt)})
                      </span>
                    </p>
                    <p className="font-semibold">{formatCurrency(2250000)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-400 print:text-gray-600">Total:</span>
            <span className="text-lg font-bold">
              {formatCurrency(4500000)}
            </span>
          </div>
          {invoice.paymentOption === "installment" && (
            <div className="mb-6 flex justify-between text-sm">
              <span className="text-gray-400 print:text-gray-600">
                Bayar sekarang:
              </span>
              <span className="text-lg font-bold text-[#4a7dff]">
                {formatCurrency(2250000)}
              </span>
            </div>
          )}

          {/* Status */}
          <div className="mb-8 rounded-lg bg-yellow-500/10 px-4 py-3 text-center text-sm">
            <span className="text-yellow-400 print:text-yellow-600">
              Menunggu Pembayaran
            </span>
          </div>

          {/* Bank Info */}
          <div className="mb-8 rounded-lg border border-white/[0.06] bg-[#0a0a0f] p-5 print:border-gray-300 print:bg-gray-50">
            <p className="mb-3 text-sm font-semibold">Transfer ke:</p>
            <div className="space-y-1 text-sm">
              <p>
                Bank:{" "}
                <span className="font-semibold">BCA</span>
              </p>
              <p>
                No. Rekening:{" "}
                <span className="font-semibold">5271688612</span>
              </p>
              <p>
                A/N:{" "}
                <span className="font-semibold">
                  PT Zenova Digital Indonesia
                </span>
              </p>
            </div>
            <p className="mt-3 text-xs text-gray-400 print:text-gray-500">
              * Cantumkan nomor invoice saat transfer
            </p>
          </div>

          {/* WhatsApp Confirm */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 block w-full rounded-xl bg-[#25d366] py-3.5 text-center font-semibold text-white transition hover:bg-[#20bd5a] print:hidden"
          >
            WhatsApp Konfirmasi &rarr;
          </a>

          <a
            href="/"
            className="block text-center text-sm text-gray-400 hover:text-white print:hidden"
          >
            Kembali ke halaman utama
          </a>
        </div>
      </div>
    </main>
  );
}

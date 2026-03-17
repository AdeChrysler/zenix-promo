"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

interface InvoiceData {
  invoiceNumber: string;
  name: string;
  email: string;
  phone: string;
  paymentOption: "full" | "installment";
  paymentMethod: string;
  paymentChannel: string;
  amount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  transactionId?: string;
  paymentNo?: string;
  paymentName?: string;
  paymentExpired?: string;
  qrisUrl?: string | null;
  qrString?: string | null;
  paymentTotal?: number;
  paidAt?: string;
}

function formatCurrency(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getDueDate(iso: string): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + 30);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-600 transition hover:bg-blue-100"
    >
      {copied ? "Tersalin!" : "Salin"}
    </button>
  );
}

function ConfettiEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 3;
        const colors = ["#3b82f6", "#10b981", "#2563eb", "#ef4444", "#8b5cf6"];
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className="absolute top-0 h-3 w-2 rounded-sm opacity-80"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [justPaid, setJustPaid] = useState(false);

  const fetchInvoice = useCallback(() => {
    return fetch(`/api/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const inv = data.invoice as InvoiceData;
          setInvoice((prev) => {
            if (prev && prev.status !== "paid" && inv.status === "paid") {
              setShowConfetti(true);
              setJustPaid(true);
              setTimeout(() => setShowConfetti(false), 5000);
            }
            return inv;
          });
        } else {
          setError(data.error || "Invoice tidak ditemukan.");
        }
      })
      .catch(() => setError("Gagal memuat invoice."));
  }, [id]);

  useEffect(() => {
    fetchInvoice().finally(() => setLoading(false));
  }, [fetchInvoice]);

  // Poll for payment status every 10 seconds
  useEffect(() => {
    if (!invoice || invoice.status === "paid") return;
    const interval = setInterval(fetchInvoice, 10000);
    return () => clearInterval(interval);
  }, [invoice, fetchInvoice]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-gray-500">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-500">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">
            Kembali ke halaman utama
          </a>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";
  const isQris = invoice.paymentMethod === "qris" || invoice.paymentChannel === "qris";

  // QR image: server generates data URL, or fallback to qrserver.com
  const rawQrSource = invoice.qrisUrl || invoice.qrString || (isQris ? invoice.paymentNo : null);
  let qrImageUrl: string | null = null;
  if (rawQrSource) {
    if (rawQrSource.startsWith("data:") || rawQrSource.startsWith("http")) {
      qrImageUrl = rawQrSource;
    } else {
      qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(rawQrSource)}`;
    }
  }

  const showPaymentNo = invoice.paymentNo && invoice.paymentNo.length <= 30 && !isQris;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
      {showConfetti && <ConfettiEffect />}

      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
          </div>

          {/* Success Banner */}
          {isPaid && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-1 text-xl font-bold text-green-600">Pembayaran Berhasil!</h2>
              {justPaid && (
                <p className="mb-3 text-sm text-green-500">Welcome to Zenix.id!</p>
              )}
              <a
                href="https://wa.me/6288988988918?text=Halo%2C%20saya%20sudah%20bayar%20Zenix.id.%20Minta%20link%20akses%20ya."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                Gabung WhatsApp Group
              </a>
            </div>
          )}

          {/* Invoice Details */}
          <div className="mb-6 space-y-1 text-sm">
            <p>
              <span className="text-gray-500">Invoice #:</span>{" "}
              <span className="font-semibold text-gray-900">{invoice.invoiceNumber}</span>
            </p>
            <p>
              <span className="text-gray-500">Tanggal:</span>{" "}
              <span className="text-gray-900">{formatDate(invoice.createdAt)}</span>
            </p>
          </div>

          {/* Customer Info */}
          <div className="mb-6 space-y-1 text-sm">
            <p className="font-semibold text-gray-500">Kepada:</p>
            <p className="text-gray-900">Nama: {invoice.name}</p>
            <p className="text-gray-900">Email: {invoice.email}</p>
            <p className="text-gray-900">WhatsApp: {invoice.phone}</p>
          </div>

          {/* Line Items */}
          <div className="mb-6 border-t border-b border-gray-200 py-4">
            <div className="mb-3 flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500">
              <span>Item</span>
              <span>Jumlah</span>
            </div>

            {invoice.paymentOption === "full" ? (
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">Zenix.id 3 Bulan Access</p>
                  <p className="text-xs text-gray-500">Full Payment</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(4500000)}</p>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-2 font-medium text-gray-900">Zenix.id 3 Bulan Access</p>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Cicilan 1/2</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(2250000)}</p>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <p className="text-gray-600">
                      Cicilan 2/2{" "}
                      <span className="text-xs text-gray-500">
                        (jatuh tempo {getDueDate(invoice.createdAt)})
                      </span>
                    </p>
                    <p className="font-semibold text-gray-900">{formatCurrency(2250000)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-500">Total:</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(4500000)}</span>
          </div>
          {invoice.paymentOption === "installment" && (
            <div className="mb-6 flex justify-between text-sm">
              <span className="text-gray-500">Bayar sekarang:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(2250000)}
              </span>
            </div>
          )}

          {/* Status */}
          {!isPaid && (
            <div className="mb-6 rounded-lg bg-blue-50 px-4 py-3 text-center text-sm">
              <span className="font-medium text-blue-600">Menunggu Pembayaran</span>
            </div>
          )}

          {/* Payment Info (not paid yet) */}
          {!isPaid && (
            <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/50 p-6">
              {isQris && qrImageUrl ? (
                <div className="text-center">
                  <p className="mb-4 text-sm font-semibold text-gray-900">Scan QR Code untuk Bayar</p>
                  <div className="mx-auto mb-4 inline-block rounded-xl bg-white p-3 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrImageUrl}
                      alt="QR Code Pembayaran"
                      className="h-[250px] w-[250px]"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Buka aplikasi e-wallet atau mobile banking Anda, lalu scan QR di atas.
                  </p>
                  {invoice.paymentExpired && (
                    <p className="mt-2 text-xs text-gray-400">
                      Berlaku sampai: {invoice.paymentExpired}
                    </p>
                  )}
                </div>
              ) : showPaymentNo ? (
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Transfer ke Virtual Account {invoice.paymentName || invoice.paymentChannel?.toUpperCase()}
                  </p>
                  <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-white px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500">Nomor VA</p>
                      <p className="text-xl font-bold tracking-wider text-gray-900">{invoice.paymentNo}</p>
                    </div>
                    <CopyButton text={invoice.paymentNo!} />
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-blue-200 bg-white px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500">Jumlah Transfer</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(invoice.amount)}
                      </p>
                    </div>
                    <CopyButton text={String(invoice.amount)} />
                  </div>
                  {invoice.paymentExpired && (
                    <p className="mt-3 text-xs text-gray-400">
                      Berlaku sampai: {invoice.paymentExpired}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Pembayaran sedang diproses. Silakan tunggu beberapa saat...
                  </p>
                </div>
              )}

              {!isPaid && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  Menunggu konfirmasi pembayaran...
                </div>
              )}
            </div>
          )}

          {/* Download PDF */}
          <button
            onClick={() => window.print()}
            className="mb-3 block w-full rounded-xl border border-blue-200 bg-blue-50 py-3.5 text-center font-semibold text-blue-600 transition hover:bg-blue-100 print:hidden"
          >
            📄 Download Invoice PDF
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/6288988988918?text=${encodeURIComponent(`Konfirmasi pembayaran ${invoice.invoiceNumber}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 block w-full rounded-xl bg-[#25d366] py-3.5 text-center font-semibold text-white transition hover:bg-[#20bd5a] print:hidden"
          >
            WhatsApp Support
          </a>

          <a
            href="/"
            className="block text-center text-sm text-gray-500 hover:text-blue-600 print:hidden"
          >
            Kembali ke halaman utama
          </a>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: "🧠",
    title: "AI Lead Scoring & Auto-Move Pipeline",
    desc: "Skor leads otomatis dan pindahkan ke pipeline yang tepat.",
  },
  {
    icon: "💬",
    title: "AI WhatsApp Chatbot Auto-Reply",
    desc: "Chatbot AI yang membalas pesan WhatsApp pelanggan 24/7.",
  },
  {
    icon: "🤖",
    title: "AI BD Sales Agent",
    desc: "Follow-up otomatis ke leads yang belum merespons.",
  },
  {
    icon: "🖥️",
    title: "Landing Page Builder + AI Generator",
    desc: "Buat landing page profesional dalam hitungan menit.",
  },
  {
    icon: "🛒",
    title: "Order Management + Payment Gateway",
    desc: "Kelola pesanan dan terima pembayaran langsung.",
  },
  {
    icon: "🚚",
    title: "Cek Ongkir & Shipping Integration",
    desc: "Integrasi pengiriman dengan cek ongkir otomatis.",
  },
  {
    icon: "📊",
    title: "Meta Pixel & Google Ads CAPI",
    desc: "Tracking konversi akurat untuk iklan Anda.",
  },
  {
    icon: "📈",
    title: "Token Usage & COGS Monitoring",
    desc: "Pantau penggunaan AI dan biaya operasional.",
  },
  {
    icon: "✅",
    title: "KYC Verification System",
    desc: "Verifikasi identitas pelanggan secara otomatis.",
  },
  {
    icon: "👥",
    title: "Multi-workspace & Team Management",
    desc: "Kelola banyak workspace dan tim dalam satu akun.",
  },
];

const faqs = [
  {
    q: "Apa itu Zenix.id?",
    a: "Platform AI sales & marketing all-in-one untuk bisnis Indonesia. Semua yang Anda butuhkan untuk mengelola leads, chatbot, landing page, dan pembayaran dalam satu dashboard.",
  },
  {
    q: "Apakah ini bayar bulanan?",
    a: "Tidak, ini pembayaran lifetime access. Bayar sekali, akses selamanya.",
  },
  {
    q: "Bagaimana cara bayar?",
    a: "Setelah mendaftar, kami akan kirim invoice via WhatsApp dan email. Anda bisa transfer ke rekening BCA kami.",
  },
  {
    q: "Bisa cicilan?",
    a: "Bisa! Pilih opsi cicilan 2x Rp 2.250.000. Cicilan pertama langsung, cicilan kedua dalam 30 hari.",
  },
  {
    q: "Ada garansi?",
    a: "Ya, 7 hari money-back guarantee jika tidak puas. Tanpa pertanyaan.",
  },
];

export default function PromoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    paymentOption: "full" as "full" | "installment",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/invoice/${data.invoiceNumber}`);
      } else {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#4a7dff]/10 blur-[120px]" />
          <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-[#10b981]/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-[#4a7dff]/30 bg-[#4a7dff]/10 px-4 py-1.5 text-sm font-medium text-[#4a7dff]">
            Lifetime Access — Penawaran Terbatas
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Zenix.id — Platform AI Sales &amp; Marketing{" "}
            <span className="bg-gradient-to-r from-[#4a7dff] to-[#10b981] bg-clip-text text-transparent">
              #1 di Indonesia
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Kelola leads WhatsApp, AI chatbot, landing page builder, dan payment
            gateway dalam satu platform.
          </p>
          <a
            href="#form"
            className="inline-block rounded-xl bg-[#4a7dff] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#4a7dff]/25 transition hover:bg-[#3a6dee] hover:shadow-[#4a7dff]/40"
          >
            Daftar Sekarang
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Semua yang Anda Butuhkan
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-gray-400">
            Satu platform lengkap untuk mengubah bisnis Anda dengan kekuatan AI.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-[#111118] p-6 transition hover:border-[#4a7dff]/30"
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Pilih Paket Anda
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-gray-400">
            Investasi sekali, manfaat selamanya.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Full Payment */}
            <div className="relative rounded-2xl border-2 border-[#10b981]/50 bg-[#111118] p-8">
              <div className="absolute -top-3 left-6 rounded-full bg-[#10b981] px-3 py-1 text-xs font-bold text-black">
                BEST VALUE
              </div>
              <h3 className="mb-1 text-xl font-bold">Full Payment</h3>
              <p className="mb-6 text-sm text-gray-400">
                Bayar sekali, akses selamanya*
              </p>
              <div className="mb-2 text-4xl font-extrabold">
                Rp 4.500.000
              </div>
              <p className="mb-8 text-sm text-[#10b981]">
                Hemat Rp 500.000 dari harga cicilan
              </p>
              <ul className="mb-8 space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#10b981]">&#10003;</span> Lifetime
                  access semua fitur
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#10b981]">&#10003;</span> Free update
                  selamanya
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#10b981]">&#10003;</span> Priority
                  support
                </li>
              </ul>
              <a
                href="#form"
                onClick={() =>
                  setForm((prev) => ({ ...prev, paymentOption: "full" }))
                }
                className="block w-full rounded-xl bg-[#10b981] py-3 text-center font-semibold text-black transition hover:bg-[#0ea572]"
              >
                Pilih Paket Ini
              </a>
            </div>

            {/* Installment */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111118] p-8">
              <h3 className="mb-1 text-xl font-bold">Cicilan 2x</h3>
              <p className="mb-6 text-sm text-gray-400">
                Bayar 2x dalam 30 hari
              </p>
              <div className="mb-2 text-4xl font-extrabold">
                Rp 2.250.000
                <span className="text-lg font-normal text-gray-400">
                  {" "}
                  x 2
                </span>
              </div>
              <p className="mb-8 text-sm text-gray-400">
                Total: Rp 4.500.000
              </p>
              <ul className="mb-8 space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#4a7dff]">&#10003;</span> Lifetime
                  access semua fitur
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4a7dff]">&#10003;</span> Free update
                  selamanya
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4a7dff]">&#10003;</span> Priority
                  support
                </li>
              </ul>
              <a
                href="#form"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    paymentOption: "installment",
                  }))
                }
                className="block w-full rounded-xl border border-[#4a7dff] py-3 text-center font-semibold text-[#4a7dff] transition hover:bg-[#4a7dff]/10"
              >
                Pilih Paket Ini
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="form" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Daftar Sekarang
          </h2>
          <p className="mx-auto mb-10 max-w-md text-center text-gray-400">
            Isi data Anda dan kami akan kirimkan invoice pembayaran.
          </p>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/[0.06] bg-[#111118] p-8"
          >
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0f] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#4a7dff]/50"
                placeholder="John Doe"
              />
            </div>
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0f] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#4a7dff]/50"
                placeholder="john@example.com"
              />
            </div>
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Nomor WhatsApp
              </label>
              <div className="flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-white/[0.08] bg-[#0a0a0f] px-3 text-sm text-gray-400">
                  +62
                </span>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full rounded-r-lg border border-white/[0.08] bg-[#0a0a0f] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#4a7dff]/50"
                  placeholder="812-xxxx-xxxx"
                />
              </div>
            </div>
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-gray-300">
                Opsi Pembayaran
              </label>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0a0a0f] p-4 transition hover:border-[#4a7dff]/30">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="full"
                    checked={form.paymentOption === "full"}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, paymentOption: "full" }))
                    }
                    className="accent-[#4a7dff]"
                  />
                  <div>
                    <div className="font-medium">
                      Full Payment — Rp 4.500.000
                    </div>
                    <div className="text-xs text-gray-400">
                      Bayar sekali, hemat Rp 500.000
                    </div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0a0a0f] p-4 transition hover:border-[#4a7dff]/30">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="installment"
                    checked={form.paymentOption === "installment"}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        paymentOption: "installment",
                      }))
                    }
                    className="accent-[#4a7dff]"
                  />
                  <div>
                    <div className="font-medium">
                      Cicilan 2x — Rp 2.250.000
                    </div>
                    <div className="text-xs text-gray-400">
                      Total Rp 4.500.000, bayar dalam 30 hari
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#4a7dff] py-4 text-lg font-semibold text-white shadow-lg shadow-[#4a7dff]/25 transition hover:bg-[#3a6dee] disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar & Dapatkan Invoice"}
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Pertanyaan Umum
          </h2>
          <p className="mx-auto mb-12 max-w-md text-center text-gray-400">
            Jawaban untuk pertanyaan yang sering diajukan.
          </p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-[#111118]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-medium"
                >
                  {faq.q}
                  <span className="ml-4 text-gray-400">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm leading-relaxed text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 py-10 text-center">
        <p className="text-sm text-gray-500">
          &copy; 2026 Zenix.id &mdash; PT Zenova Digital Indonesia
        </p>
        <a
          href="https://wa.me/6281234567890"
          className="mt-2 inline-block text-sm text-[#4a7dff] hover:underline"
        >
          Hubungi via WhatsApp
        </a>
      </footer>
    </main>
  );
}

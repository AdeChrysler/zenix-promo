"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const featureGroups = [
  {
    title: "AI Engine",
    icon: "brain",
    features: [
      { name: "AI Intent Scoring", desc: "Skor otomatis setiap lead berdasarkan niat beli." },
      { name: "AI WhatsApp Chatbot", desc: "Chatbot AI membalas pesan pelanggan 24/7." },
      { name: "AI BD Sales Agent", desc: "Follow-up otomatis ke leads yang belum merespons." },
      { name: "AI Page Generator", desc: "Buat landing page profesional dengan AI." },
    ],
  },
  {
    title: "Sales Tools",
    icon: "cart",
    features: [
      { name: "Landing Page Builder", desc: "Drag & drop builder untuk halaman konversi tinggi." },
      { name: "Order Management", desc: "Kelola pesanan dari satu dashboard terpusat." },
      { name: "Payment Gateway", desc: "Terima pembayaran QRIS, VA, dan transfer bank." },
      { name: "Shipping Integration", desc: "Cek ongkir dan buat pengiriman otomatis." },
    ],
  },
  {
    title: "Growth Features",
    icon: "chart",
    features: [
      { name: "Meta Pixel & CAPI", desc: "Tracking konversi server-side untuk iklan akurat." },
      { name: "Google Ads CAPI", desc: "Offline conversion tracking untuk Google Ads." },
      { name: "Team Management", desc: "Multi-workspace dan kelola tim dalam satu akun." },
      { name: "API Access", desc: "Integrasi dengan tools favorit Anda via REST API." },
    ],
  },
];

const testimonials = [
  {
    name: "Andi S.",
    role: "Owner Coaching Business",
    quote: "Revenue naik 3x dalam 2 bulan pertama pakai Zenix. AI chatbot-nya benar-benar game changer.",
  },
  {
    name: "Sarah M.",
    role: "Digital Product Creator",
    quote: "Follow-up otomatis hemat 4 jam/hari. Sekarang saya bisa fokus bikin konten, bukan chase leads.",
  },
  {
    name: "Budi P.",
    role: "E-commerce Owner",
    quote: "Conversion rate naik dari 2% ke 8%. Landing page AI-nya langsung convert dari hari pertama.",
  },
];

const faqs = [
  {
    q: "Apa itu Zenix.id?",
    a: "Platform AI sales & marketing all-in-one untuk bisnis Indonesia. Semua yang Anda butuhkan untuk mengelola leads, chatbot, landing page, dan pembayaran dalam satu dashboard.",
  },
  {
    q: "Apakah ini bayar bulanan?",
    a: "Tidak. Ini pembayaran lifetime access. Bayar sekali, akses selamanya. Termasuk semua update di masa depan.",
  },
  {
    q: "Bagaimana cara bayar?",
    a: "Setelah mengisi form, Anda akan langsung diarahkan ke halaman pembayaran. Bisa bayar via QRIS (scan QR) atau Virtual Account BCA/BNI/Mandiri.",
  },
  {
    q: "Bisa cicilan?",
    a: "Bisa! Pilih opsi cicilan 2x Rp 2.250.000. Cicilan pertama langsung, cicilan kedua dalam 30 hari.",
  },
  {
    q: "Ada garansi?",
    a: "Ya, 7 hari money-back guarantee. Jika tidak puas, kami kembalikan 100% uang Anda. Tanpa pertanyaan.",
  },
  {
    q: "Apakah slot benar-benar terbatas?",
    a: "Ya. Kami membatasi jumlah pengguna di setiap batch untuk memastikan kualitas support dan performa server.",
  },
];

type PaymentMethodType = "qris" | "bca" | "bni" | "mandiri";

export default function PromoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    paymentOption: "full" as "full" | "installment",
    paymentMethod: "qris" as PaymentMethodType,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const method = form.paymentMethod === "qris" ? "qris" : "va";
    const channel = form.paymentMethod;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: method,
          paymentChannel: channel,
        }),
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

  const paymentMethods: { value: PaymentMethodType; label: string; badge?: string }[] = [
    { value: "qris", label: "QRIS (Scan QR)", badge: "Rekomendasi" },
    { value: "bca", label: "VA BCA" },
    { value: "bni", label: "VA BNI" },
    { value: "mandiri", label: "VA Mandiri" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-blue-400/[0.07] blur-[150px]" />
          <div className="absolute top-60 right-0 h-[400px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-blue-600/[0.04] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600">
            Exclusive Access &mdash; Hanya untuk Bisnis Serius
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Exclusive Access ke{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Zenix.id Platform
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Platform AI Sales &amp; Marketing paling canggih di Indonesia.
            <br className="hidden sm:block" />
            Hanya untuk bisnis yang serius ingin scale.
          </p>
          <a
            href="#form"
            className="group relative inline-block overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]"
          >
            Claim Your Spot
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </a>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: "🔒", label: "Lifetime Access" },
              { icon: "🤖", label: "AI-Powered" },
              { icon: "💰", label: "ROI Guaranteed" },
              { icon: "⚡", label: "Setup 5 Menit" },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-gray-700"
              >
                <span className="text-lg">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Semua yang Anda Butuhkan,{" "}
            <span className="text-blue-600">Dalam Satu Platform</span>
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-gray-500">
            Teknologi enterprise-grade yang biasanya hanya tersedia untuk perusahaan besar.
          </p>
          <div className="grid gap-8 lg:grid-cols-3">
            {featureGroups.map((group, gi) => (
              <div key={gi}>
                <h3 className="mb-5 text-lg font-bold text-blue-600">{group.title}</h3>
                <div className="space-y-3">
                  {group.features.map((f, fi) => (
                    <div
                      key={fi}
                      className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                    >
                      <h4 className="mb-1 font-semibold text-gray-900">{f.name}</h4>
                      <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-sm font-medium uppercase tracking-widest text-blue-600">
            Testimoni
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Dipercaya 500+ Bisnis di Indonesia
          </h2>
          <p className="mx-auto mb-14 max-w-lg text-center text-gray-500">
            Mereka sudah membuktikan hasilnya. Sekarang giliran Anda.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex gap-1 text-blue-500">
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-xl sm:p-12">
            <div className="mb-2 text-center text-sm font-bold uppercase tracking-widest text-blue-600">
              Founder&apos;s Deal
            </div>
            <h2 className="mb-2 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Harga Spesial Early Adopter
            </h2>
            <p className="mx-auto mb-12 max-w-md text-center text-gray-500">
              Harga ini tidak akan bertahan lama. Amankan posisi Anda sekarang.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Full Payment */}
              <div
                className={`relative cursor-pointer rounded-2xl border-2 p-8 transition ${
                  form.paymentOption === "full"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
                onClick={() => setForm((prev) => ({ ...prev, paymentOption: "full" }))}
              >
                <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-blue-600 to-green-500 px-3 py-1 text-xs font-bold text-white">
                  BEST VALUE
                </div>
                <h3 className="mb-1 text-xl font-bold text-gray-900">Full Payment</h3>
                <p className="mb-4 text-sm text-gray-500">Bayar sekali, akses selamanya</p>
                <div className="mb-1 text-4xl font-extrabold text-gray-900">Rp 4.500.000</div>
                <p className="mb-6 text-sm text-blue-600">Hemat Rp 500.000</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">&#10003;</span> Lifetime access semua fitur
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">&#10003;</span> Free update selamanya
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">&#10003;</span> Priority support
                  </li>
                </ul>
              </div>

              {/* Installment */}
              <div
                className={`cursor-pointer rounded-2xl border-2 p-8 transition ${
                  form.paymentOption === "installment"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
                onClick={() => setForm((prev) => ({ ...prev, paymentOption: "installment" }))}
              >
                <h3 className="mb-1 text-xl font-bold text-gray-900">Cicilan 2x</h3>
                <p className="mb-4 text-sm text-gray-500">Bayar 2x dalam 30 hari</p>
                <div className="mb-1 text-4xl font-extrabold text-gray-900">
                  Rp 2.250.000
                  <span className="text-lg font-normal text-gray-500"> x 2</span>
                </div>
                <p className="mb-6 text-sm text-gray-500">Total: Rp 4.500.000</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">&#10003;</span> Lifetime access semua fitur
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">&#10003;</span> Free update selamanya
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">&#10003;</span> Priority support
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-gray-500">
              <p>
                <span className="mr-1">⏰</span> Harga naik setelah 50 pendaftar
              </p>
              <p className="font-semibold text-blue-600">
                <span className="mr-1">🔥</span> Sisa 23 slot tersedia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="form" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-blue-100 bg-white p-8 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-center gap-2 text-center">
              <svg
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">Secure Checkout</h2>
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="John Doe"
              />
            </div>
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="john@example.com"
              />
            </div>
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Nomor WhatsApp
              </label>
              <div className="flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                  +62
                </span>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-r-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="812-xxxx-xxxx"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((pm) => (
                  <label
                    key={pm.value}
                    className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                      form.paymentMethod === pm.value
                        ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-200"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.value}
                      checked={form.paymentMethod === pm.value}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, paymentMethod: pm.value }))
                      }
                      className="sr-only"
                    />
                    {pm.label}
                    {pm.badge && (
                      <span className="absolute -top-2 -right-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {pm.badge}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading
                  ? "Memproses pembayaran..."
                  : `Bayar ${form.paymentOption === "full" ? "Rp 4.500.000" : "Rp 2.250.000"}`}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              <span className="mr-1">🔒</span> Data Anda aman & terenkripsi
            </p>
          </form>
        </div>
      </section>

      {/* Guarantee */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-3xl">
            🛡️
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">7 Hari Money-Back Guarantee</h2>
          <p className="text-gray-500">
            Tidak puas? Kami kembalikan 100% uang Anda. Tanpa pertanyaan.
            <br />
            Anda tidak punya risiko sama sekali.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Pertanyaan Umum
          </h2>
          <p className="mx-auto mb-12 max-w-md text-center text-gray-500">
            Jawaban untuk pertanyaan yang sering diajukan.
          </p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-medium text-gray-900"
                >
                  {faq.q}
                  <span
                    className={`ml-4 text-gray-400 transition-transform ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm leading-relaxed text-gray-500">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-10 text-center">
        <p className="text-sm text-gray-500">
          &copy; 2026 Zenix.id &mdash; PT Zenova Digital Indonesia
        </p>
        <a
          href="https://wa.me/6281234567890"
          className="mt-2 inline-block text-sm text-blue-600 hover:underline"
        >
          Hubungi via WhatsApp
        </a>
      </footer>
    </main>
  );
}

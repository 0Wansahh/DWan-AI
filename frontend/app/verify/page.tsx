"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(emailQuery);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        throw new Error("Respon tidak valid dari server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Gagal verifikasi");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
        <input 
          type="email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="nama@email.com"
          readOnly={!!emailQuery} // Kunci jika email sudah otomatis terisi dari URL
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Kode Verifikasi (6 Digit)</label>
        <input 
          type="text" 
          required 
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-3 text-center tracking-widest text-2xl bg-slate-950 border border-slate-700 rounded-md text-amber-400 font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          placeholder="------"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading || code.length < 6}
        className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-md transition-all disabled:opacity-50"
      >
        {loading ? "Memverifikasi..." : "Verifikasi Akun"}
      </button>

      {/* Pesan Error / Sukses di bawah tombol */}
      {error && <div className="mt-2 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md text-sm text-center">{error}</div>}
      {success && <div className="mt-2 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-md text-sm text-center">Verifikasi sukses! Mengalihkan ke login...</div>}
    </form>
  );
}

export default function VerifyCode() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400 mb-2">
            Verifikasi Email
          </h1>
          <p className="text-slate-400 text-sm">Masukkan 6 digit kode yang kami kirimkan ke emailmu (Cek folder Spam).</p>
        </div>

        <Suspense fallback={<div className="text-center text-slate-400">Memuat form...</div>}>
          <VerifyContent />
        </Suspense>

        <p className="mt-6 text-center text-sm text-slate-400">
          Kembali ke <Link href="/login" className="text-amber-400 hover:underline">Halaman Login</Link>
        </p>
      </div>
    </main>
  );
}

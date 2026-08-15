"use client"; // Wajib untuk komponen yang punya interaksi (form, state, dll)

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  
  // State untuk menyimpan inputan user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk status loading dan pesan error/sukses
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fungsi yang dijalankan saat tombol Daftar diklik
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

        try {
      // Mengirim data ke API menggunakan proxy Next.js
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // Ambil teks respon dulu untuk antisipasi jika server error bukan JSON
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        throw new Error("Respon server tidak valid: " + textResponse);
      }

      if (!response.ok) {
        throw new Error(data.error || "Gagal melakukan registrasi");
      }

          // Jika sukses
      setSuccess(true);
      setTimeout(() => {
      router.push("/verify?email=" + encodeURIComponent(email)); 
    }, 2000);


    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
      
      {/* Background Grid & Glow Tipis (Biar serasi dengan halaman utama) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

      {/* Kotak Form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400 mb-2">
            Buat Akun Baru
          </h1>
          <p className="text-slate-400 text-sm">Mulai perjalanan trading AI-mu hari ini.</p>
        </div>

        {/* Pesan Error atau Sukses */}
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md text-sm text-center">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-md text-sm text-center">Registrasi sukses! Mengalihkan ke login...</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Masukkan namamu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-md transition-all disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Sudah punya akun? <Link href="/login" className="text-amber-400 hover:underline">Masuk di sini</Link>
        </p>

      </div>
    </main>
  );
}

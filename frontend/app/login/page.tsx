"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Mengirim data ke API menggunakan jalur proxy Next.js (seperti saat Register)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal masuk, cek email dan password.");
      }

      // Jika sukses, kita simpan tokennya di LocalStorage HP/Browser kamu
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard"); // Kita akan arahkan ke halaman Dashboard (nanti kita buat)
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
      
      {/* Background Grid & Glow Tipis */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>

      {/* Kotak Form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400 mb-2">
            Selamat Datang Kembali
          </h1>
          <p className="text-slate-400 text-sm">Masuk untuk melihat prediksi AI terbaru.</p>
        </div>

        {/* Pesan Error atau Sukses */}
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md text-sm text-center">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-md text-sm text-center">Login berhasil! Memuat dashboard...</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Masukkan passwordmu"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-md transition-all disabled:opacity-50"
          >
            {loading ? "Memeriksa..." : "Masuk Akun"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Belum punya akun? <Link href="/register" className="text-blue-400 hover:underline">Daftar di sini</Link>
        </p>

      </div>
    </main>
  );
}

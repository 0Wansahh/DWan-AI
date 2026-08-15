"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Cek apakah ada data user di localStorage (tanda sudah login)
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login"); // Kalau belum login, lempar balik ke login
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!user) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Memuat...</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-amber-400">
            Halo, {user.name}! 👋
          </h1>
          <p className="text-slate-400">Selamat datang kembali di DWan AI Dashboard.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition"
        >
          Keluar
        </button>
      </div>

      {/* Grid Konten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Contoh */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500/50 transition">
          <h2 className="text-xl font-semibold mb-2 text-amber-400">Prediksi AI</h2>
          <p className="text-slate-400">Analisis pasar terbaru akan segera muncul di sini.</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/50 transition">
          <h2 className="text-xl font-semibold mb-2 text-blue-400">Portofolio</h2>
          <p className="text-slate-400">Pantau aset crypto kamu secara real-time.</p>
        </div>
      </div>
    </main>
  );
}

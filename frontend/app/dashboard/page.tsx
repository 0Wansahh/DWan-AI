"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Import TradingView secara dinamis
const AdvancedRealTimeChart = dynamic(
  () => import("react-ts-tradingview-widgets").then((mod) => mod.AdvancedRealTimeChart),
  { ssr: false }
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  const [prediction, setPrediction] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [errorAi, setErrorAi] = useState<string>("");

  const [chartSymbol, setChartSymbol] = useState("BINANCE:BTCUSDT");
  
  // STATE BARU: Untuk mengatur apakah toolbar ditampilkan atau disembunyikan
  const [showToolbar, setShowToolbar] = useState<boolean>(false); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const getAiPrediction = async () => {
    setLoadingAi(true);
    setErrorAi("");
    try {
      const response = await fetch("/api/ai/predict");
      const textResponse = await response.text();
      
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        throw new Error("Respon tidak valid dari server.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil prediksi AI");
      }
      setPrediction(data.prediction);
    } catch (err: any) {
      setErrorAi(err.message);
    } finally {
      setLoadingAi(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Memuat Dashboard...</div>;

  return (
    // PADDING DIPERBAIKI: p-2 di HP, p-8 di Laptop (md:p-8)
    <main className="min-h-screen bg-slate-950 text-white p-2 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4 md:pb-6 px-2 md:px-0 mt-4 md:mt-0">
        <div>
          <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-amber-400">
            Halo, {user.name}! 👋
          </h1>
          <p className="text-slate-400 text-xs md:text-base">Markas Besar DWan AI.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-3 py-1.5 md:px-4 md:py-2 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition"
        >
          Keluar
        </button>
      </div>

      {/* Panel Chart TradingView */}
      <div className="mb-6 p-2 md:p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 px-2 md:px-0 mt-2 md:mt-0">
          <h2 className="text-lg md:text-xl font-semibold text-blue-400">Live Market Chart</h2>
          
          {/* Tombol Toggle Toolbar & Dropdown Koin */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowToolbar(!showToolbar)}
              className="flex-1 sm:flex-none bg-slate-800 border border-slate-700 text-slate-300 text-xs md:text-sm px-3 py-2 rounded-md hover:bg-slate-700 transition"
            >
              {showToolbar ? "Tutup Tools" : "Buka Tools"}
            </button>

            <select 
              value={chartSymbol}
              onChange={(e) => setChartSymbol(e.target.value)}
              className="flex-1 sm:flex-none bg-slate-950 border border-slate-700 text-white text-xs md:text-sm px-3 py-2 rounded-md outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="BINANCE:BTCUSDT">BTC/USDT</option>
              <option value="BINANCE:ETHUSDT">ETH/USDT</option>
              <option value="BINANCE:SOLUSDT">SOL/USDT</option>
            </select>
          </div>
        </div>
        
        {/* Kontainer Chart */}
        <div className="h-[400px] md:h-[450px] w-full rounded-lg overflow-hidden border border-slate-800">
          <AdvancedRealTimeChart 
            theme="dark" 
            symbol={chartSymbol} 
            interval="60"
            timezone="Asia/Jakarta"
            style="1"
            locale="id"
            width="100%" 
            height="100%" 
            allow_symbol_change={false}
            // MENGGUNAKAN STATE UNTUK TOGGLE TOOLBAR
            hide_side_toolbar={!showToolbar} 
          />
        </div>
      </div>

      {/* Grid Bawah: AI & Aset */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel Prediksi AI */}
        <div className="lg:col-span-2 p-4 md:p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col min-h-[300px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg md:text-xl font-semibold text-amber-400">Analisis Pasar AI</h2>
            <button 
              onClick={getAiPrediction}
              disabled={loadingAi}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500/10 text-amber-400 text-sm md:text-base border border-amber-500/20 rounded hover:bg-amber-500 hover:text-slate-900 transition disabled:opacity-50"
            >
              {loadingAi ? "Menganalisis..." : "Tarik Data & Prediksi"}
            </button>
          </div>
          
          <div className="flex-1 bg-slate-950 p-4 md:p-6 rounded-lg border border-slate-800 overflow-auto shadow-inner text-sm md:text-base">
            {errorAi && <p className="text-red-400 text-center mt-4">{errorAi}</p>}
            
            {!prediction && !loadingAi && !errorAi && (
              <p className="text-slate-500 text-center mt-10">Belum ada analisis terbaru. Klik tombol di atas untuk memerintahkan AI.</p>
            )}
            
            {loadingAi && (
              <div className="flex flex-col justify-center items-center h-full mt-10 space-y-4">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-amber-400 animate-pulse text-sm">Menghubungkan ke Gemini AI...</p>
              </div>
            )}
            
            {prediction && !loadingAi && (
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {prediction}
              </div>
            )}
          </div>
        </div>

        {/* Panel Pantauan Koin */}
        <div className="p-4 md:p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-blue-400">Aset Dipantau</h2>
          <p className="text-slate-400 mb-6 text-xs md:text-sm">Klik koin untuk melihat chart-nya.</p>
          
          <ul className="space-y-3">
            <li 
              onClick={() => setChartSymbol("BINANCE:BTCUSDT")}
              className={`flex justify-between items-center p-3 md:p-4 rounded-lg border cursor-pointer transition ${chartSymbol === "BINANCE:BTCUSDT" ? "bg-slate-800 border-blue-500" : "bg-slate-950 border-slate-800 hover:border-slate-600"}`}
            >
              <span className="font-bold text-orange-400 text-sm md:text-base">Bitcoin (BTC)</span>
              <span className="text-[10px] md:text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Terkoneksi API</span>
            </li>
            <li 
              onClick={() => setChartSymbol("BINANCE:ETHUSDT")}
              className={`flex justify-between items-center p-3 md:p-4 rounded-lg border cursor-pointer transition ${chartSymbol === "BINANCE:ETHUSDT" ? "bg-slate-800 border-blue-500" : "bg-slate-950 border-slate-800 hover:border-slate-600"}`}
            >
              <span className="font-bold text-indigo-400 text-sm md:text-base">Ethereum (ETH)</span>
              <span className="text-[10px] md:text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Terkoneksi API</span>
            </li>
            <li 
              onClick={() => setChartSymbol("BINANCE:SOLUSDT")}
              className={`flex justify-between items-center p-3 md:p-4 rounded-lg border cursor-pointer transition ${chartSymbol === "BINANCE:SOLUSDT" ? "bg-slate-800 border-blue-500" : "bg-slate-950 border-slate-800 hover:border-slate-600"}`}
            >
              <span className="font-bold text-teal-400 text-sm md:text-base">Solana (SOL)</span>
              <span className="text-[10px] md:text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Terkoneksi API</span>
            </li>
          </ul>
        </div>
        
      </div>
    </main>
  );
}

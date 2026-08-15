import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden p-6">
      
      {/* Background Grid (Pola Garis Kertas Grafik) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Grafik Garis Trading (SVG Latar Belakang) */}
      <svg className="absolute w-full h-full opacity-30 pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
        <path d="M0,400 L100,350 L200,380 L400,200 L500,250 L700,100 L850,150 L1000,50 L1000,400 Z" fill="url(#chart-gradient)" />
        <path d="M0,400 L100,350 L200,380 L400,200 L500,250 L700,100 L850,150 L1000,50" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10 5" className="animate-[dash_10s_linear_infinite]" />
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Efek Cahaya / Glow Tambahan (Biru & Emas) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>

      {/* Konten Utama */}
      <div className="relative z-10 text-center max-w-3xl flex flex-col items-center">
        
        {/* Label Kecil */}
        <div className="inline-block mb-6 px-5 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md text-sm font-semibold text-amber-400 shadow-lg">
          📊 AI Powered Trading
        </div>
        
        {/* Judul Utama dengan Gradasi Biru dan Emas */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-200 to-amber-500 pb-2">
          DWan AI Crypto
        </h1>
        
        {/* Deskripsi */}
        <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl">
          Tingkatkan profitmu dengan analisis pasar dan prediksi cerdas berbasis Artificial Intelligence. 
          Simpel, cepat, dan sangat akurat.
        </p>
        
        {/* Tombol Interaktif */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link 
            href="/register" 
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md font-bold text-lg text-slate-900 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300"
          >
            Mulai Sekarang 🚀
          </Link>
          <Link 
            href="/login" 
            className="flex items-center justify-center px-8 py-4 bg-slate-800/50 backdrop-blur-md border border-slate-600 rounded-md font-bold text-lg text-white hover:bg-slate-700 hover:scale-105 transition-all duration-300"
          >
            Masuk Akun
          </Link>
        </div>

      </div>
    </main>
  );
}

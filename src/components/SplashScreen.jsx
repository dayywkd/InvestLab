import { useState, useEffect } from 'react';

export default function SplashScreen({ onStart }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#12130F] text-[#F4EFE2] min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none w-full px-4">
      {/* Background Subtle Candlestick Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex justify-around items-center">
        <div className="w-1 h-48 bg-[#E8622C]"></div>
        <div className="w-1 h-64 bg-[#4A9B6E]"></div>
        <div className="w-1 h-32 bg-[#C1453A]"></div>
        <div className="w-1 h-56 bg-[#D4A24C]"></div>
      </div>

      {/* Main Content Canvas */}
      <div className="z-10 flex flex-col items-center justify-center w-full max-w-[380px] text-center gap-6">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 mb-4 bg-[#1C1E17] border border-[#E8622C]/40 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(232,98,44,0.25)]">
            <span className="material-symbols-outlined text-[#E8622C] text-5xl">candlestick_chart</span>
          </div>
          <h1 className="font-outfit text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#F4EFE2]">
            INVEST<span className="text-[#E8622C]">LAB</span>
          </h1>
          <p className="font-inter text-xs md:text-sm text-[#9C9884] tracking-wider uppercase mt-1 font-medium">
            Market Terminal Simulation
          </p>
        </div>

        {/* Loader or Start Action */}
        <div className="w-full flex flex-col items-center gap-4 mt-6">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              {/* Candlestick Chart Animated Loader */}
              <div className="flex items-end justify-center gap-2 h-10">
                <div className="w-1.5 bg-[#4A9B6E] rounded-full candlestick-bar h-6"></div>
                <div className="w-1.5 bg-[#E8622C] rounded-full candlestick-bar h-8"></div>
                <div className="w-1.5 bg-[#D4A24C] rounded-full candlestick-bar h-5"></div>
                <div className="w-1.5 bg-[#4A9B6E] rounded-full candlestick-bar h-7"></div>
              </div>
              <p className="font-mono text-xs text-[#9C9884] tracking-widest uppercase animate-pulse">
                Menyiapkan pasar... {progress}%
              </p>
            </div>
          ) : (
            <button
              onClick={onStart}
              className="w-full py-3.5 px-6 rounded-full bg-[#E8622C] hover:bg-[#E8622C]/90 active:scale-97 text-[#12130F] font-outfit font-bold text-base uppercase tracking-wider shadow-[0_8px_24px_rgba(232,98,44,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span>Masuk Pasar</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

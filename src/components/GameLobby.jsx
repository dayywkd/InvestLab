import { useGameStore } from '../store/useGameStore';

export default function GameLobby({ onStartGame, onBack }) {
  const userLevel = useGameStore(state => state.userLevel);

  return (
    <div className="bg-[#12130F] text-[#F4EFE2] font-inter min-h-screen flex flex-col justify-between select-none px-4 py-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between py-2 border-b border-[#262920]">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#1C1E17] border border-[#262920] flex items-center justify-center text-[#9C9884] hover:text-[#F4EFE2] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>
        <h1 className="font-outfit text-xl font-black uppercase tracking-tight text-[#F4EFE2]">
          LOBBY <span className="text-[#E8622C]">PERMAINAN</span>
        </h1>
        <div className="w-9"></div>
      </header>

      {/* Main Content (design.md Section 3) */}
      <main className="my-auto py-6 flex flex-col items-center gap-8 text-center">
        {/* Subtitle */}
        <div>
          <span className="font-mono text-[10px] text-[#9C9884] uppercase tracking-widest bg-[#1C1E17] px-3 py-1 rounded-full border border-[#262920]">
            Simulasi 3 Pemain
          </span>
          <h2 className="font-outfit text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#F4EFE2] mt-3">
            Siap Memasuki Bursa?
          </h2>
        </div>

        {/* 3 Horizontal Player Avatars */}
        <div className="w-full bg-[#1C1E17] border border-[#262920] rounded-2xl p-6 shadow-xl">
          <p className="font-outfit text-xs text-[#9C9884] uppercase tracking-wider mb-5 font-bold">
            Peserta Pertandingan
          </p>
          <div className="flex justify-around items-center gap-2">
            {/* Player 1 (You) */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#2C2E27] to-[#171813] border-2 border-[#E8622C] flex items-center justify-center shadow-[0_0_16px_rgba(232,98,44,0.3)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 pointer-events-none rounded-full"></div>
                  <svg className="w-9 h-9 md:w-11 md:h-11 text-[#E8622C]" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A9.75 9.75 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#E8622C] text-[#12130F] font-outfit font-bold text-[9px] px-1.5 py-0.5 rounded-full border border-[#12130F]">
                  YOU
                </span>
              </div>
              <div>
                <p className="font-outfit font-bold text-xs md:text-sm text-[#F4EFE2]">User (Anda)</p>
                <p className="font-mono text-[10px] text-[#9C9884]">Level {userLevel}</p>
              </div>
            </div>

            {/* Player 2 (Bot Wira) */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#2C2E27] to-[#171813] border-2 border-[#3D7CA6] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 pointer-events-none rounded-full"></div>
                  <span className="material-symbols-outlined text-3xl md:text-4xl text-[#3D7CA6]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#3D7CA6] text-[#F4EFE2] font-mono font-bold text-[8px] px-1.5 py-0.5 rounded-full border border-[#12130F] uppercase">
                  BOT
                </span>
              </div>
              <div>
                <p className="font-outfit font-bold text-xs md:text-sm text-[#F4EFE2]">Wira</p>
                <p className="font-mono text-[10px] text-[#9C9884]">AI Aggressive</p>
              </div>
            </div>

            {/* Player 3 (Bot Citra) */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#2C2E27] to-[#171813] border-2 border-[#8A6BAE] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 pointer-events-none rounded-full"></div>
                  <span className="material-symbols-outlined text-3xl md:text-4xl text-[#8A6BAE]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#8A6BAE] text-[#F4EFE2] font-mono font-bold text-[8px] px-1.5 py-0.5 rounded-full border border-[#12130F] uppercase">
                  BOT
                </span>
              </div>
              <div>
                <p className="font-outfit font-bold text-xs md:text-sm text-[#F4EFE2]">Citra</p>
                <p className="font-mono text-[10px] text-[#9C9884]">AI Balanced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Match Info Summary Cards */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-4 flex flex-col items-center">
            <span className="material-symbols-outlined text-[#D4A24C] text-xl mb-1">payments</span>
            <span className="font-mono text-xs text-[#9C9884] uppercase">Saldo Awal</span>
            <span className="font-outfit font-bold text-lg text-[#4A9B6E]">30 Koin</span>
          </div>
          <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-4 flex flex-col items-center">
            <span className="material-symbols-outlined text-[#E8622C] text-xl mb-1">hourglass_top</span>
            <span className="font-mono text-xs text-[#9C9884] uppercase">Total Ronde</span>
            <span className="font-outfit font-bold text-lg text-[#F4EFE2]">6 Ronde</span>
          </div>
        </div>
      </main>

      {/* Footer Start Game Button */}
      <footer className="w-full pb-2">
        <button
          onClick={onStartGame}
          className="w-full py-4 px-6 rounded-full bg-[#E8622C] hover:bg-[#E8622C]/90 active:scale-97 text-[#12130F] font-outfit font-bold text-base uppercase tracking-wider shadow-[0_8px_24px_rgba(232,98,44,0.35)] transition-all flex items-center justify-center gap-2"
        >
          <span>Mulai Permainan</span>
          <span className="material-symbols-outlined text-xl">rocket_launch</span>
        </button>
      </footer>
    </div>
  );
}

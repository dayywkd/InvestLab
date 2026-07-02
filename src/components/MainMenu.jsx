import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function MainMenu({ onPlay, onResetState }) {
  const userLevel = useGameStore(state => state.userLevel);
  const userGlobalCoins = useGameStore(state => state.userGlobalCoins);
  const userExp = useGameStore(state => state.userExp);

  const [showTutorial, setShowTutorial] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Fetch leaderboard when modal opened
  useEffect(() => {
    if (showLeaderboard) {
      useGameStore.getState().fetchLeaderboard().then(data => {
        if (data && data.length > 0) {
          setLeaderboardData(data);
        }
      });
    }
  }, [showLeaderboard]);

  const formatCoins = (coins) => {
    if (coins >= 1000000) return (coins / 1000000).toFixed(1) + 'M';
    if (coins >= 1000) return (coins / 1000).toFixed(1) + 'K';
    return coins;
  };

  return (
    <div className="bg-[#12130F] text-[#F4EFE2] font-inter min-h-screen flex flex-col justify-between select-none px-4 py-4 max-w-5xl mx-auto w-full">
      {/* Lightweight Header (design.md Section 2) */}
      <header className="flex items-center justify-between py-2 border-b border-[#262920]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfile(true)}>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#262920] border border-[#E8622C] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[#F4EFE2]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-[#D4A24C] text-[#12130F] font-outfit font-bold text-[9px] px-1 rounded-full">
              L{userLevel}
            </span>
          </div>
          <h1 className="font-outfit text-2xl font-black uppercase tracking-tight text-[#F4EFE2]">
            STOCK<span className="text-[#E8622C]">LAB</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#1C1E17] border border-[#262920] px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[#D4A24C] text-base">payments</span>
            <span className="font-mono font-bold text-xs text-[#4A9B6E]">{formatCoins(userGlobalCoins)}</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 rounded-full bg-[#1C1E17] border border-[#262920] flex items-center justify-center text-[#9C9884] hover:text-[#F4EFE2] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>
        </div>
      </header>

      {/* Bento Grid Layout (design.md Section 2) */}
      <main className="my-auto py-4">
        {/* Desktop Bento Grid / Mobile Vertical Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Main Dominant Tile: PLAY NOW (2x size on Desktop) */}
          <button
            onClick={onPlay}
            className="md:col-span-2 md:row-span-2 bg-[#E8622C] hover:bg-[#E8622C]/95 active:scale-97 text-[#12130F] rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[180px] md:min-h-[280px] shadow-[0_12px_32px_rgba(232,98,44,0.3)] transition-transform duration-150 relative overflow-hidden group border border-amber-500/30 text-left"
          >
            {/* Background Accent Lines */}
            <div className="absolute -right-10 -bottom-10 opacity-15 text-[#12130F] pointer-events-none">
              <span className="material-symbols-outlined text-[180px]">trending_up</span>
            </div>

            <div className="flex justify-between items-start z-10">
              <span className="bg-[#12130F]/20 text-[#12130F] font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider">
                Trading Floor Ready
              </span>
              <span className="material-symbols-outlined text-4xl text-[#12130F] group-hover:translate-x-1 transition-transform">
                play_circle
              </span>
            </div>

            <div className="z-10 mt-6">
              <h2 className="font-outfit text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-[#12130F]">
                PLAY NOW
              </h2>
              <p className="font-inter text-xs md:text-sm font-medium opacity-85 mt-2 max-w-xs text-[#12130F]">
                Masuk ke lantai bursa 6-ronde dan rasakan simulasi pasar saham kompetitif!
              </p>
            </div>
          </button>

          {/* Tile 2: Tutorial */}
          <button
            onClick={() => setShowTutorial(true)}
            className="bg-[#1C1E17] hover:bg-[#262920] active:scale-97 text-[#F4EFE2] rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-[#262920] min-h-[110px] shadow-md transition-all text-left"
          >
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#D4A24C] text-2xl">school</span>
              <span className="text-[#9C9884] text-xs">→</span>
            </div>
            <div>
              <h3 className="font-outfit text-base font-bold uppercase tracking-wide">Tutorial</h3>
              <p className="text-[11px] text-[#9C9884]">Aturan permainan & cara bidding</p>
            </div>
          </button>

          {/* Tile 3: Skor Terbaik (Leaderboard) */}
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-[#1C1E17] hover:bg-[#262920] active:scale-97 text-[#F4EFE2] rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-[#262920] min-h-[110px] shadow-md transition-all text-left"
          >
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#4A9B6E] text-2xl">emoji_events</span>
              <span className="text-[#9C9884] text-xs">→</span>
            </div>
            <div>
              <h3 className="font-outfit text-base font-bold uppercase tracking-wide">Skor Terbaik</h3>
              <p className="text-[11px] text-[#9C9884]">Leaderboard pasar global</p>
            </div>
          </button>

          {/* Tile 4: Riwayat Terakhir */}
          <button
            onClick={() => setShowHistory(true)}
            className="bg-[#1C1E17] hover:bg-[#262920] active:scale-97 text-[#F4EFE2] rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-[#262920] min-h-[110px] shadow-md transition-all text-left"
          >
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#3D7CA6] text-2xl">history</span>
              <span className="text-[#9C9884] text-xs">→</span>
            </div>
            <div>
              <h3 className="font-outfit text-base font-bold uppercase tracking-wide">Riwayat Match</h3>
              <p className="text-[11px] text-[#9C9884]">Catatan statistik transaksi</p>
            </div>
          </button>

          {/* Tile 5: Profil Trader */}
          <button
            onClick={() => setShowProfile(true)}
            className="bg-[#1C1E17] hover:bg-[#262920] active:scale-97 text-[#F4EFE2] rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-[#262920] min-h-[110px] shadow-md transition-all text-left md:col-span-2"
          >
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#E8622C] text-2xl">account_balance_wallet</span>
              <span className="font-mono text-xs text-[#4A9B6E] font-bold">EXP: {userExp}/1000</span>
            </div>
            <div>
              <h3 className="font-outfit text-base font-bold uppercase tracking-wide">Profil Trader</h3>
              <p className="text-[11px] text-[#9C9884]">User (Anda) • Investor Level {userLevel}</p>
            </div>
          </button>
        </div>
      </main>

      {/* Footer Status Summary */}
      <footer className="text-center py-2 text-[10px] text-[#9C9884] uppercase tracking-widest border-t border-[#262920]/50 font-mono">
        StockLab Market Terminal v1.1 • Client-Side Offline Mode
      </footer>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowTutorial(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-[420px] w-full flex flex-col max-h-[85vh] z-50 animate-scale-up">
            <h3 className="font-outfit text-lg font-bold text-[#E8622C] uppercase border-b border-[#262920] pb-2">Panduan Pasar StockLab</h3>
            <div className="font-inter text-[#9C9884] space-y-3 mt-3 text-xs leading-relaxed overflow-y-auto pr-1">
              <p><strong className="text-[#F4EFE2]">Tujuan Game:</strong> Hasilkan Net Worth tertinggi di akhir Ronde 6 melalui perputaran modal bursa.</p>
              <p><strong className="text-[#F4EFE2]">1. Fase Bidding:</strong> Tawar koin secara rahasia untuk merebut giliran jalan pertama.</p>
              <p><strong className="text-[#F4EFE2]">2. Fase Aksi:</strong> Ambil 1 dari 6 kartu hibrida di meja:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong className="text-[#F4EFE2]">Opsi A (Beli Saham):</strong> Simpan kartu sebagai saham seharga bursa.</li>
                <li><strong className="text-[#F4EFE2]">Opsi B (Gunakan Skill):</strong> Pakai skill kartu secara gratis (Info Bursa, Rumor, Quick Buy, Trading Fee, Akuisisi).</li>
              </ul>
              <p><strong className="text-[#F4EFE2]">3. Fase Jual:</strong> Likuidasi unit saham pilihanmu menjadi koin cash.</p>
              <p><strong className="text-[#F4EFE2]">4. Fase Ekonomi:</strong> Fluktuasi harga otomatis dapat memicu <strong>Stock Split</strong> (saham 2x lipat) atau <strong>Stock Crash</strong> (saham hangus).</p>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="mt-4 bg-[#E8622C] text-[#12130F] font-outfit font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowLeaderboard(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-[420px] w-full flex flex-col max-h-[85vh] z-50 animate-scale-up">
            <h3 className="font-outfit text-lg font-bold text-[#4A9B6E] uppercase border-b border-[#262920] pb-2">Skor Terbaik (Leaderboard)</h3>
            <div className="flex flex-col gap-2 my-3 overflow-y-auto pr-1">
              {leaderboardData.length > 0 ? (
                leaderboardData.map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl border ${item.username === 'User (Anda)' ? 'bg-[#E8622C]/15 border-[#E8622C]' : 'bg-[#262920]/60 border-transparent'}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`font-outfit font-black text-sm w-5 text-center ${idx === 0 ? 'text-[#D4A24C]' : 'text-[#9C9884]'}`}>#{idx + 1}</span>
                      <div>
                        <span className="font-inter font-semibold text-[#F4EFE2] text-xs block">{item.username}</span>
                        <span className="font-mono text-[9px] text-[#9C9884]">Level {item.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#12130F] px-2.5 py-1 rounded-lg border border-[#262920]">
                      <span className="font-mono text-[#4A9B6E] font-bold text-xs">{formatCoins(item.globalCoins)}</span>
                      <span className="material-symbols-outlined text-[#D4A24C] text-xs">payments</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-[#9C9884] text-xs animate-pulse font-mono">Memuat data leaderboard...</div>
              )}
            </div>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="mt-2 bg-[#262920] text-[#F4EFE2] font-outfit font-bold py-2.5 rounded-xl text-xs uppercase"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Riwayat Match Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowHistory(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-[400px] w-full flex flex-col z-50 animate-scale-up">
            <h3 className="font-outfit text-lg font-bold text-[#3D7CA6] uppercase border-b border-[#262920] pb-2">Riwayat Match</h3>
            <div className="text-center py-8 text-[#9C9884]">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-40">history</span>
              <p className="text-xs">Belum ada catatan transaksi pertandingan.</p>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="bg-[#262920] text-[#F4EFE2] font-outfit font-bold py-2.5 rounded-xl text-xs uppercase"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowSettings(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-[400px] w-full flex flex-col z-50 animate-scale-up">
            <h3 className="font-outfit text-lg font-bold text-[#F4EFE2] uppercase border-b border-[#262920] pb-2">Pengaturan Game</h3>
            <div className="py-4 space-y-3">
              <p className="text-xs text-[#9C9884] text-center">Setel ulang progres lokal game atau bersihkan penyimpanan otomatis.</p>
              <button
                onClick={() => {
                  onResetState();
                  setShowSettings(false);
                  alert('Progres game berhasil di-reset!');
                }}
                className="w-full bg-[#C1453A] text-[#F4EFE2] font-outfit font-bold py-2.5 rounded-xl text-xs uppercase flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                Reset Progres Game
              </button>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="bg-[#262920] text-[#F4EFE2] font-outfit font-bold py-2.5 rounded-xl text-xs uppercase"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowProfile(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-[400px] w-full flex flex-col z-50 animate-scale-up">
            <h3 className="font-outfit text-lg font-bold text-[#E8622C] uppercase border-b border-[#262920] pb-2">Profil Investor</h3>
            <div className="flex flex-col items-center gap-3 py-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#262920] border-2 border-[#E8622C] flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-4xl text-[#9C9884]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#D4A24C] text-[#12130F] font-outfit font-bold text-[10px] px-1.5 rounded-full">
                  L{userLevel}
                </span>
              </div>
              <div className="text-center">
                <h4 className="font-outfit font-bold text-base text-[#F4EFE2]">User (Anda)</h4>
                <p className="text-[10px] font-mono text-[#9C9884] uppercase">Junior Stock Analyst</p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full mt-1">
                <div className="bg-[#262920] p-2.5 rounded-xl border border-[#262920] text-center">
                  <span className="text-[9px] text-[#9C9884] uppercase block">Saldo Global</span>
                  <span className="font-mono text-[#4A9B6E] font-bold text-xs">{formatCoins(userGlobalCoins)}🪙</span>
                </div>
                <div className="bg-[#262920] p-2.5 rounded-xl border border-[#262920] text-center">
                  <span className="text-[9px] text-[#9C9884] uppercase block">Pengalaman</span>
                  <span className="font-mono text-[#D4A24C] font-bold text-xs">{userExp}/1000 EXP</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowProfile(false)}
              className="bg-[#262920] text-[#F4EFE2] font-outfit font-bold py-2.5 rounded-xl text-xs uppercase"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

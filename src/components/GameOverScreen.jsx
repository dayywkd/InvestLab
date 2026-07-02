import { useGameStore } from '../store/useGameStore';

export default function GameOverScreen({ onPlayAgain, onBackToHome }) {
  const store = useGameStore();
  const { players } = store;

  // Siapkan data pemain untuk pemeringkatan
  const playerRankList = Object.keys(players).map(key => ({
    key,
    ...players[key]
  }));

  // Urutkan dari Net Worth tertinggi
  playerRankList.sort((a, b) => (b.netWorth ?? b.coins) - (a.netWorth ?? a.coins));

  const userRank = playerRankList.findIndex(p => p.key === 'user') + 1;
  const user = players.user;

  // Rincian Breakdown Net Worth User
  const userDebtPenalty = user.debtCount * 15;
  const userNetWorth = user.netWorth ?? (user.coins - userDebtPenalty);
  const userLiquidatedAssets = userNetWorth + userDebtPenalty;

  return (
    <div className="bg-[#12130F] text-[#F4EFE2] font-inter min-h-screen flex flex-col justify-between select-none px-4 py-6 max-w-xl mx-auto w-full">
      {/* Header Result */}
      <header className="text-center flex flex-col items-center gap-2 pt-2">
        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-lg ${
          userRank === 1 ? 'bg-[#D4A24C]/20 border-[#D4A24C]' : 'bg-[#C1453A]/20 border-[#C1453A]'
        }`}>
          <span className={`material-symbols-outlined text-3xl ${
            userRank === 1 ? 'text-[#D4A24C]' : 'text-[#C1453A]'
          }`}>
            {userRank === 1 ? 'emoji_events' : 'sentiment_dissatisfied'}
          </span>
        </div>

        <h1 className="font-outfit text-3xl font-black uppercase tracking-tight text-[#F4EFE2]">
          {userRank === 1 ? 'SELAMAT! ANDA MENANG' : 'PERTANDINGAN SELESAI'}
        </h1>
        <p className="font-mono text-xs text-[#9C9884]">
          Peringkat Akhir Anda: <strong className={userRank === 1 ? 'text-[#D4A24C]' : 'text-[#F4EFE2]'}>#{userRank} dari 3 Pemain</strong>
        </p>
      </header>

      {/* Main Content: Ranks List & Breakdown Card (design.md Section 6) */}
      <main className="my-auto py-4 space-y-4">
        {/* Peringkat Vertikal (Highlight Winner #1 in Gold) */}
        <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-4 shadow-xl space-y-2">
          <h3 className="font-outfit text-xs font-bold uppercase text-[#9C9884] tracking-wider mb-2">
            🏆 Peringkat Pasar Akhir
          </h3>

          {playerRankList.map((player, idx) => {
            const isWinner = idx === 0;
            const isUser = player.key === 'user';

            return (
              <div
                key={player.key}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-[#D4A24C]/15 border-[#D4A24C] text-[#D4A24C]'
                    : isUser
                    ? 'bg-[#E8622C]/10 border-[#E8622C]/40 text-[#F4EFE2]'
                    : 'bg-[#262920] border-transparent text-[#9C9884]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-outfit font-black text-base w-6 text-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-outfit font-bold text-sm text-[#F4EFE2] block leading-none">
                      {player.name} {isUser && '(Anda)'}
                    </span>
                    <span className="font-mono text-[10px] opacity-75">
                      🔴 {player.debtCount} Utang
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#4A9B6E] block">
                    {player.netWorth ?? player.coins}🪙
                  </span>
                  <span className="font-mono text-[9px] text-[#9C9884]">Net Worth</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Breakdown Net Worth Card User */}
        <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-4 shadow-xl space-y-3">
          <h3 className="font-outfit text-xs font-bold uppercase text-[#9C9884] tracking-wider border-b border-[#262920] pb-2">
            📊 Breakdown Net Worth Kamu
          </h3>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-[#9C9884]">
              <span>Aset Terlikuidasi (Kas + Reksa Dana):</span>
              <span className="font-bold text-[#F4EFE2]">{userLiquidatedAssets} Koin</span>
            </div>
            <div className="flex justify-between items-center text-[#C1453A]">
              <span>Denda Utang ({user.debtCount} Kartu × 15 Koin):</span>
              <span className="font-bold">-{userDebtPenalty} Koin</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#262920] text-[#D4A24C] font-outfit text-sm font-bold">
              <span>NET WORTH AKHIR:</span>
              <span className="font-mono text-base">{userNetWorth} Koin</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTAs (design.md Section 6) */}
      <footer className="flex flex-col gap-2 w-full">
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-full bg-[#E8622C] hover:bg-[#E8622C]/90 active:scale-97 text-[#12130F] font-outfit font-bold text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">replay</span>
          <span>Main Lagi</span>
        </button>

        <button
          onClick={onBackToHome}
          className="w-full py-3 px-6 rounded-full bg-[#262920] hover:bg-[#262920]/80 active:scale-97 text-[#F4EFE2] font-outfit font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">home</span>
          <span>Kembali ke Menu</span>
        </button>
      </footer>
    </div>
  );
}

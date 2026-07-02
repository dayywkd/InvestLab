import { useState, useEffect } from 'react';
import { useGameStore, SECTOR_CONFIG } from '../store/useGameStore';

const getSectorColorTheme = (sector) => {
  switch (sector) {
    case 'Properti':
      return {
        gradient: 'from-[#C97A3D] to-[#8C4E1E] border-[#C97A3D]',
        text: 'text-[#C97A3D]',
        bg: 'bg-[#C97A3D]/20',
        badge: 'bg-[#C97A3D]/20 text-[#C97A3D] border-[#C97A3D]/40',
        hex: '#C97A3D'
      };
    case 'Infrastruktur':
      return {
        gradient: 'from-[#3D7CA6] to-[#234F70] border-[#3D7CA6]',
        text: 'text-[#3D7CA6]',
        bg: 'bg-[#3D7CA6]/20',
        badge: 'bg-[#3D7CA6]/20 text-[#3D7CA6] border-[#3D7CA6]/40',
        hex: '#3D7CA6'
      };
    case 'Industri':
      return {
        gradient: 'from-[#6E7378] to-[#43474B] border-[#6E7378]',
        text: 'text-[#6E7378]',
        bg: 'bg-[#6E7378]/20',
        badge: 'bg-[#6E7378]/20 text-[#6E7378] border-[#6E7378]/40',
        hex: '#6E7378'
      };
    case 'Consumer':
      return {
        gradient: 'from-[#5FA35A] to-[#356131] border-[#5FA35A]',
        text: 'text-[#5FA35A]',
        bg: 'bg-[#5FA35A]/20',
        badge: 'bg-[#5FA35A]/20 text-[#5FA35A] border-[#5FA35A]/40',
        hex: '#5FA35A'
      };
    case 'ReksaDana':
      return {
        gradient: 'from-[#8A6BAE] to-[#553B73] border-[#8A6BAE]',
        text: 'text-[#8A6BAE]',
        bg: 'bg-[#8A6BAE]/20',
        badge: 'bg-[#8A6BAE]/20 text-[#8A6BAE] border-[#8A6BAE]/40',
        hex: '#8A6BAE'
      };
    default:
      return {
        gradient: 'from-[#262920] to-[#1C1E17] border-[#9C9884]',
        text: 'text-[#9C9884]',
        bg: 'bg-[#262920]',
        badge: 'bg-[#262920] text-[#9C9884] border-[#9C9884]/40',
        hex: '#9C9884'
      };
  }
};

const getSkillInfo = (skillType) => {
  switch (skillType) {
    case 'info':
      return { label: 'Info Bursa', icon: 'info', desc: 'Intip bursa +2 koin.' };
    case 'rumor':
      return { label: 'Rumor', icon: 'campaign', desc: 'Manipulasi harga (2x).' };
    case 'quick_buy':
      return { label: 'Quick Buy', icon: 'bolt', desc: '2 saham gratis & end turn.' };
    case 'trading_fee':
      return { label: 'Trading Fee', icon: 'percent', desc: 'Jual instan saham.' };
    case 'akuisisi':
      return { label: 'Akuisisi', icon: 'handshake', desc: 'Curi 1 saham pemain.' };
    default:
      return { label: 'None', icon: 'help', desc: '' };
  }
};

const getPriceTrendColor = (sector, prices, priceHistories) => {
  const history = priceHistories[sector] || [];
  if (history.length < 2) return 'bg-[#9C9884]';
  const currentPrice = prices[sector];
  const prevPrice = history[history.length - 2];
  if (currentPrice > prevPrice) return 'bg-[#4A9B6E] shadow-[0_0_8px_#4A9B6E]';
  if (currentPrice < prevPrice) return 'bg-[#C1453A] shadow-[0_0_8px_#C1453A]';
  return 'bg-[#9C9884]';
};

const getCardGlowClass = (sector, price) => {
  const config = SECTOR_CONFIG[sector];
  if (!config) return '';
  if (price >= config.maxPrice - 2) {
    return 'border-[#D4A24C] shadow-[0_0_15px_rgba(212,162,76,0.6)] animate-pulse';
  }
  if (price <= config.minPrice + 1) {
    return 'border-[#C1453A] shadow-[0_0_15px_rgba(193,69,58,0.6)] animate-pulse';
  }
  return '';
};

export default function GameScreen() {
  const store = useGameStore();
  const {
    phase,
    turn,
    prices,
    priceHistories,
    players,
    playOrder,
    activePlayerIndex,
    actionBoard,
    activeEconomyCards,
    logs,
    lastEvent,
    rumorCountRemaining,
    quickBuyCountRemaining,
    resetToHome
  } = store;

  // Local UI States
  const [bidValue, setBidValue] = useState(1);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Mobile Navigation Bottom Tab State ('meja' | 'portofolio' | 'log')
  const [mobileTab, setMobileTab] = useState('meja');

  // Modal Card Detail / Bottom Sheet
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedSkillCardIndex, setSelectedSkillCardIndex] = useState(null);
  const [showCardDetailModal, setShowCardDetailModal] = useState(false);

  // Skill Modals
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoBursaData, setInfoBursaData] = useState([]);

  const [showTradingFeeModal, setShowTradingFeeModal] = useState(false);
  const [tradingFeeSector, setTradingFeeSector] = useState(null);
  const [tradingFeeAmount, setTradingFeeAmount] = useState(1);

  const [showAkuisisiModal, setShowAkuisisiModal] = useState(false);
  const [akuisisiSector, setAkuisisiSector] = useState('Properti');
  const [akuisisiTarget, setAkuisisiTarget] = useState('bot1');

  const activePlayerKey = playOrder?.[activePlayerIndex];
  const isUserTurn = (phase === 'ACTION' || phase === 'SELL') && activePlayerKey === 'user';
  const activePlayer = players?.[activePlayerKey];

  const handleOpenInfoBursa = () => {
    const details = store.getInfoBursaDetails ? store.getInfoBursaDetails() : [];
    setInfoBursaData(details);
    setShowInfoModal(true);
  };

  // Reset bidValue saat masuk fase Bidding
  useEffect(() => {
    if (phase === 'BIDDING') {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setBidValue(1);
    }
  }, [phase]);

  // AI Bot Trigger Effect
  useEffect(() => {
    if (activePlayer?.isBot) {
      if (phase === 'ACTION') {
        const timer = setTimeout(() => {
          if (useGameStore.getState().phase === 'ACTION') {
            store.runBotAction();
          }
        }, 1000);
        return () => clearTimeout(timer);
      } else if (phase === 'SELL') {
        const timer = setTimeout(() => {
          if (useGameStore.getState().phase === 'SELL') {
            store.runBotSell();
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, activePlayerKey, activePlayer?.isBot, store]);

  // 1. VIEW: PREPARATION
  const renderPreparationView = () => {
    return (
      <div className="w-full max-w-lg mx-auto flex flex-col gap-6 animate-fade-in text-center py-4">
        <div>
          <span className="font-mono text-[10px] text-[#9C9884] uppercase tracking-widest bg-[#1C1E17] px-3 py-1 rounded-full border border-[#262920]">
            Fase 1 dari 4
          </span>
          <h2 className="font-outfit text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#F4EFE2] mt-3">
            Fase Persiapan Bursa
          </h2>
          <p className="font-inter text-xs text-[#9C9884] mt-1">
            Harga pembukaan sektor telah disinkronisasi. Persiapkan modal awal Anda.
          </p>
        </div>

        {/* Bento Grid 2x2 Sektor Prices */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {Object.keys(SECTOR_CONFIG).map((sector) => {
            const theme = getSectorColorTheme(sector);
            const price = prices[sector];
            return (
              <div
                key={sector}
                className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-4 flex flex-col justify-between items-start text-left relative overflow-hidden"
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`material-symbols-outlined text-xl ${theme.text}`}>
                    {SECTOR_CONFIG[sector].icon}
                  </span>
                  <span className="font-outfit text-xl font-black text-[#F4EFE2] font-mono">
                    {price}🪙
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className="font-outfit text-sm font-bold uppercase text-[#F4EFE2]">{sector}</h4>
                  <p className="text-[10px] text-[#9C9884] font-mono">
                    Min {SECTOR_CONFIG[sector].minPrice} • Max {SECTOR_CONFIG[sector].maxPrice}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => store.startTrading()}
          className="w-full py-4 px-6 rounded-full bg-[#E8622C] hover:bg-[#E8622C]/90 active:scale-97 text-[#12130F] font-outfit font-bold text-base uppercase tracking-wider shadow-[0_8px_24px_rgba(232,98,44,0.35)] transition-all flex items-center justify-center gap-2"
        >
          <span>Mulai Fase Bidding</span>
          <span className="material-symbols-outlined text-xl">gavel</span>
        </button>
      </div>
    );
  };

  // 2. VIEW: BIDDING
  const renderBiddingView = () => {
    const userCash = players.user.coins;
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 animate-fade-in text-center py-4">
        <div>
          <span className="font-mono text-[10px] text-[#9C9884] uppercase tracking-widest bg-[#1C1E17] px-3 py-1 rounded-full border border-[#262920]">
            Fase Bidding • Penentuan Urutan
          </span>
          <h2 className="font-outfit text-2xl md:text-3xl font-bold uppercase text-[#F4EFE2] mt-3">
            Tawar Koin Anda
          </h2>
          <p className="font-inter text-xs text-[#9C9884] mt-1">
            Penawar tertinggi akan jalan pertama di Fase Aksi dan Fase Jual.
          </p>
        </div>

        <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-6 flex flex-col items-center gap-4">
          <span className="text-[11px] font-mono text-[#9C9884] uppercase">Jumlah Taruhan Anda</span>
          <div className="font-outfit text-5xl font-black text-[#D4A24C]">
            {bidValue} <span className="text-xl">🪙</span>
          </div>

          <input
            type="range"
            min="0"
            max={Math.max(0, userCash)}
            value={bidValue}
            onChange={(e) => setBidValue(parseInt(e.target.value))}
            className="w-full h-2 bg-[#12130F] rounded-lg appearance-none cursor-pointer accent-[#E8622C]"
          />
          <div className="flex justify-between w-full font-mono text-[10px] text-[#9C9884]">
            <span>0 Koin</span>
            <span>Kas Anda: {userCash} Koin</span>
          </div>

          <button
            onClick={() => store.submitUserBid(bidValue)}
            className="w-full py-3.5 px-6 rounded-full bg-[#E8622C] hover:bg-[#E8622C]/90 active:scale-97 text-[#12130F] font-outfit font-bold text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span className="material-symbols-outlined text-lg">gavel</span>
            <span>Kirim Penawaran</span>
          </button>
        </div>
      </div>
    );
  };

  // 3. VIEW: ACTION BOARD (Meja Kartu Hibrida)
  const renderActionView = () => {
    return (
      <div className="w-full flex flex-col gap-4 animate-fade-in items-center">
        {quickBuyCountRemaining > 0 && (
          <div className="bg-[#D4A24C]/15 border border-[#D4A24C] rounded-2xl p-4 text-center max-w-md w-full animate-bounce shadow-md">
            <div className="flex items-center justify-center gap-2 text-[#D4A24C]">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <h4 className="font-outfit text-sm font-bold uppercase">Mode Quick Buy Aktif</h4>
            </div>
            <p className="font-inter text-xs text-[#9C9884] mt-1 leading-normal">
              Silakan pilih <strong>{quickBuyCountRemaining} kartu</strong> lagi dari meja secara gratis!
            </p>
          </div>
        )}

        {/* Carousel Container (Fan/Overlap Layout) */}
        <div className="w-full overflow-x-auto hide-scrollbar pb-6 pt-4 px-2 flex justify-start md:justify-center items-center min-h-[290px]">
          <div className="flex justify-center items-center mx-auto">
            {actionBoard.map((card, idx) => {
              if (!card) {
                return (
                  <div
                    key={idx}
                    className="w-32 h-52 md:w-40 md:h-60 rounded-2xl border-2 border-dashed border-[#262920] flex flex-col items-center justify-center opacity-30 bg-[#1C1E17] mx-1"
                  >
                    <span className="material-symbols-outlined text-3xl text-[#9C9884]">drafts</span>
                    <span className="font-mono text-[9px] uppercase text-[#9C9884] mt-1">Kosong</span>
                  </div>
                );
              }

              const theme = getSectorColorTheme(card.sector);
              const skillInfo = getSkillInfo(card.skillType);
              const price = prices[card.sector];

              const trendColor = getPriceTrendColor(card.sector, prices, priceHistories);
              const glowClass = getCardGlowClass(card.sector, price);

              const fanRotations = [
                "-rotate-6 translate-y-2 hover:-translate-y-6 hover:rotate-0",
                "-rotate-3 translate-y-1 hover:-translate-y-6 hover:rotate-0",
                "-rotate-1 hover:-translate-y-6 hover:rotate-0",
                "rotate-1 hover:-translate-y-6 hover:rotate-0",
                "rotate-3 translate-y-1 hover:-translate-y-6 hover:rotate-0",
                "rotate-6 translate-y-2 hover:-translate-y-6 hover:rotate-0"
              ];

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isUserTurn) {
                      if (quickBuyCountRemaining > 0) {
                        store.executeQuickBuySelection(idx);
                      } else {
                        setSelectedCardIndex(idx);
                        setShowCardDetailModal(true);
                      }
                    }
                  }}
                  className={`w-32 h-52 md:w-40 md:h-60 bg-[#1C1E17] p-1 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] flex flex-col border border-[#262920] transition-all duration-300 cursor-pointer select-none relative -mx-2 md:-mx-3 z-20 ${
                    fanRotations[idx]
                  } ${
                    !isUserTurn ? 'opacity-65 pointer-events-none' : 'hover:z-50 hover:scale-105'
                  }`}
                >
                  {/* Inner Face Card */}
                  <div className={`rounded-xl flex-grow flex flex-col justify-between p-2 relative overflow-hidden bg-gradient-to-br ${theme.gradient} ${glowClass} text-[#F4EFE2]`}>
                    {/* Header */}
                    <div className="flex justify-between items-start z-20">
                      <span className="material-symbols-outlined text-xs md:text-sm bg-black/30 p-0.5 rounded-full">
                        {SECTOR_CONFIG[card.sector].icon}
                      </span>
                      <span className="font-outfit font-black text-[10px] md:text-xs bg-black/40 px-1.5 py-0.5 rounded-full">
                        {price}🪙
                      </span>
                    </div>

                    {/* Center Icon */}
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-[#F4EFE2]/95 rounded-full rotate-[-15deg] flex items-center justify-center shadow-inner mx-auto my-auto z-20 relative">
                      <span
                        className={`material-symbols-outlined text-2xl md:text-3xl rotate-[15deg] ${theme.text}`}
                      >
                        {SECTOR_CONFIG[card.sector].icon}
                      </span>
                    </div>

                    {/* Footer Tag */}
                    <div className="z-20 mt-auto flex flex-col gap-0.5">
                      <div className={`h-1 w-6 rounded-full ${trendColor} mx-auto mb-0.5`}></div>
                      <span className="font-outfit text-[9px] md:text-[11px] font-bold uppercase text-center leading-none">
                        {card.name}
                      </span>
                      <div className="flex items-center justify-center gap-0.5 bg-black/40 px-1 py-0.5 rounded-full max-w-max mx-auto text-[7px] md:text-[8px] font-semibold uppercase mt-0.5">
                        <span className="material-symbols-outlined text-[8px]">{skillInfo.icon}</span>
                        <span className="truncate">{skillInfo.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Efek Rumor Controls */}
        {rumorCountRemaining > 0 && (
          <div className="bg-[#1C1E17] border border-[#D4A24C] rounded-2xl p-4 flex flex-col items-center gap-2 w-full max-w-md">
            <span className="font-outfit text-xs text-[#D4A24C] uppercase font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-base">campaign</span>
              KONTROL EFEK RUMOR (Sisa: {rumorCountRemaining}x)
            </span>
            <div className="flex gap-2 flex-wrap justify-center mt-1">
              {['Properti', 'Infrastruktur', 'Industri', 'Consumer'].map(sec => (
                <div key={sec} className="bg-[#262920] rounded-xl p-2 border border-[#262920] flex items-center justify-between gap-2 w-32">
                  <span className="font-outfit text-xs text-[#F4EFE2] font-bold">{sec}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => store.completeUserRumor(sec, 1)}
                      className="w-6 h-6 bg-[#4A9B6E] text-[#12130F] rounded font-bold text-xs flex items-center justify-center hover:opacity-90"
                    >
                      +
                    </button>
                    <button
                      onClick={() => store.completeUserRumor(sec, -1)}
                      className="w-6 h-6 bg-[#C1453A] text-[#F4EFE2] rounded font-bold text-xs flex items-center justify-center hover:opacity-90"
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 4. VIEW: SELL
  const renderSellView = () => {
    const user = players.user;
    const userStocksList = Object.keys(user.stocks).filter(s => user.stocks[s] > 0);
    if (user.mutualFunds > 0) {
      userStocksList.push('ReksaDana');
    }

    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-4 animate-fade-in py-2">
        <div className="text-center">
          <span className="font-mono text-[10px] text-[#9C9884] uppercase tracking-widest bg-[#1C1E17] px-3 py-1 rounded-full border border-[#262920]">
            Fase 3 • Penjualan Saham
          </span>
          <h3 className="font-outfit text-xl font-bold uppercase text-[#F4EFE2] mt-2">
            Giliran Penjualan Portofolio
          </h3>
        </div>

        {userStocksList.length === 0 ? (
          <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-6 text-center">
            <p className="text-xs text-[#9C9884] mb-3">Anda tidak memiliki lembar saham untuk dijual pada fase ini.</p>
            <button
              onClick={() => store.passSell('user')}
              className="w-full py-3 rounded-full bg-[#262920] hover:bg-[#262920]/80 text-[#F4EFE2] font-outfit text-xs font-bold uppercase"
            >
              Pass / Lewati Giliran
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {userStocksList.map(sec => {
              const count = sec === 'ReksaDana' ? user.mutualFunds : user.stocks[sec];
              const unitPrice = prices[sec];
              const totalVal = count * unitPrice;

              return (
                <div key={sec} className="bg-[#1C1E17] border border-[#262920] rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-outfit text-sm font-bold uppercase text-[#F4EFE2]">{sec}</h4>
                    <span className="font-mono text-[10px] text-[#9C9884]">
                      {count} Lembar × {unitPrice}🪙 = <strong className="text-[#4A9B6E]">{totalVal}🪙</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => store.sellStock('user', sec)}
                    className="py-2 px-4 rounded-xl bg-[#4A9B6E] hover:bg-[#4A9B6E]/90 text-[#12130F] font-outfit font-bold text-xs uppercase"
                  >
                    Jual Semua
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => store.passSell('user')}
              className="w-full py-3 rounded-full bg-[#262920] hover:bg-[#262920]/80 text-[#F4EFE2] font-outfit text-xs font-bold uppercase mt-2"
            >
              Pass / Selesai Jual
            </button>
          </div>
        )}
      </div>
    );
  };

  // 5. VIEW: ECONOMY (Fase 4: Pembukaan Kartu Berita Ekonomi Sektor)
  const renderEconomyView = () => {
    const isRevealed = activeEconomyCards !== null && Object.keys(activeEconomyCards).length > 0;
    
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6 animate-fade-in text-center py-4">
        <div>
          <span className="font-mono text-[10px] text-[#9C9884] uppercase tracking-widest bg-[#1C1E17] px-3 py-1 rounded-full border border-[#262920]">
            Fase 4 • Fluktuasi Pasar
          </span>
          <h2 className="font-outfit text-2xl md:text-3xl font-bold uppercase text-[#F4EFE2] mt-3">
            Hasil Berita Ekonomi Sektor
          </h2>
          <p className="font-inter text-xs text-[#9C9884] mt-1">
            Berita makroekonomi bergulir dan mempengaruhi harga pasar secara instan.
          </p>
        </div>

        {!isRevealed ? (
          <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[220px]">
            <div className="flex items-end justify-center gap-2 h-10">
              <div className="w-1.5 bg-[#4A9B6E] rounded-full candlestick-bar h-6"></div>
              <div className="w-1.5 bg-[#C1453A] rounded-full candlestick-bar h-8"></div>
              <div className="w-1.5 bg-[#D4A24C] rounded-full candlestick-bar h-5"></div>
              <div className="w-1.5 bg-[#4A9B6E] rounded-full candlestick-bar h-7"></div>
            </div>
            <p className="font-mono text-xs text-[#9C9884] uppercase tracking-wider animate-pulse">
              Membuka berita bursa...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* List Berita per Sektor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {Object.keys(activeEconomyCards).map(sector => {
                const card = activeEconomyCards[sector];
                if (!card) return null;
                const theme = getSectorColorTheme(sector);
                const isPositive = card.change > 0 || card.type === 'general_up' || card.type === 'industrial_boom' || card.type === 'consumer_frenzy';
                const isNegative = card.change < 0 || card.type === 'general_down';
                
                let changeText = '0';
                if (card.type === 'general_up') changeText = '+1';
                else if (card.type === 'general_down') changeText = '-1';
                else if (card.change !== undefined) {
                  changeText = card.change > 0 ? `+${card.change}` : `${card.change}`;
                }

                return (
                  <div
                    key={sector}
                    className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-mono text-[9px] uppercase tracking-wider font-bold ${theme.text}`}>
                        {sector}
                      </span>
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                        isPositive ? 'bg-[#4A9B6E]/20 text-[#4A9B6E]' : isNegative ? 'bg-[#C1453A]/20 text-[#C1453A]' : 'bg-[#262920] text-[#9C9884]'
                      }`}>
                        {changeText}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h4 className="font-outfit text-sm font-bold text-[#F4EFE2] uppercase">{card.title}</h4>
                      <p className="text-[11px] text-[#9C9884] leading-relaxed mt-1">{card.text || 'Fluktuasi harga bursa.'}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => store.completeEconomyPhase()}
              className="w-full py-4 px-6 rounded-full bg-[#E8622C] hover:bg-[#E8622C]/90 active:scale-97 text-[#12130F] font-outfit font-bold text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{turn >= 6 ? 'Lihat Hasil Akhir' : 'Lanjutkan ke Ronde Berikutnya'}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render Section Portofolio Pemain (User & Bot)
  const renderPortfolioSection = () => {
    return (
      <div className="flex flex-col gap-3 w-full">
        <h3 className="font-outfit text-xs font-bold uppercase text-[#9C9884] tracking-wider">
          Portofolio Peserta Market
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {playOrder.map(pKey => {
            const p = players[pKey];
            if (!p) return null;
            const isCurrentActive = activePlayerKey === pKey;

            return (
              <div
                key={pKey}
                className={`bg-[#1C1E17] border rounded-2xl p-3.5 flex flex-col justify-between ${
                  isCurrentActive ? 'border-[#E8622C] shadow-[0_0_15px_rgba(232,98,44,0.2)]' : 'border-[#262920]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-outfit font-bold text-sm text-[#F4EFE2] block">{p.name}</span>
                    <span className="font-mono text-[10px] text-[#4A9B6E] font-bold">{p.coins} Koin</span>
                  </div>
                  {p.debtCards > 0 && (
                    <span className="bg-[#C1453A]/20 text-[#C1453A] border border-[#C1453A]/40 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      🔴 {p.debtCards} Utang
                    </span>
                  )}
                </div>

                {/* Listing Stocks */}
                <div className="space-y-1 font-mono text-[10px] text-[#9C9884] border-t border-[#262920] pt-2">
                  {Object.keys(p.stocks).map(sec => (
                    <div key={sec} className="flex justify-between">
                      <span>{sec}:</span>
                      <strong className="text-[#F4EFE2]">{p.stocks[sec]} lembar</strong>
                    </div>
                  ))}
                  <div className="flex justify-between text-[#8A6BAE]">
                    <span>Reksa Dana:</span>
                    <strong>{p.mutualFunds} unit</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Log Bursa Section
  const renderLogBursaSection = () => {
    return (
      <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-4 flex flex-col h-full max-h-[360px]">
        <h4 className="font-outfit text-xs font-bold uppercase text-[#9C9884] tracking-wider mb-2 pb-1 border-b border-[#262920]">
          Data Feed Log Bursa
        </h4>
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-2 font-mono text-[10px] text-[#9C9884] leading-relaxed">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-1.5 border-b border-[#262920]/40 pb-1.5 last:border-b-0">
              <span className="material-symbols-outlined text-xs text-[#E8622C]">show_chart</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#12130F] text-[#F4EFE2] font-inter min-h-screen flex flex-col justify-between select-none pb-20 lg:pb-0">
      {/* 1. STICKY HEADER (design.md Section 4) */}
      <header className="sticky top-0 z-40 bg-[#1C1E17] border-b border-[#262920] px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="w-8 h-8 rounded-full bg-[#262920] flex items-center justify-center text-[#9C9884] hover:text-[#F4EFE2] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
          <div>
            <span className="font-outfit font-bold text-sm text-[#F4EFE2] block leading-tight">
              Ronde {turn}/6
            </span>
            <span className="font-mono text-[9px] text-[#9C9884] uppercase">
              Fase: {phase}
            </span>
          </div>
        </div>

        {/* Status Indicators: Saldo Koin & Debt Counter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#12130F] border border-[#262920] px-3 py-1 rounded-full shadow-inner">
            <svg className="w-3.5 h-3.5 text-[#D4A24C]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="url(#goldGradientGameHeader)" stroke="#D4A24C" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="7" fill="none" stroke="#D4A24C" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M12 7V17M9 10H14C15 10 15 12 14 12C13 12 11 12 10 12C9 12 9 14 10 14H15" stroke="#D4A24C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="goldGradientGameHeader" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFEAA7" />
                  <stop offset="50%" stopColor="#D4A24C" />
                  <stop offset="100%" stopColor="#8A601B" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-mono font-bold text-xs text-[#4A9B6E]">{players.user.coins}</span>
          </div>

          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
            players.user.debtCards > 0 ? 'bg-[#C1453A]/20 text-[#C1453A] border border-[#C1453A]/40' : 'bg-[#262920] text-[#9C9884]'
          }`}>
            <span>🔴</span>
            <span>{players.user.debtCards}</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-3 py-4 flex flex-col gap-4">
        {/* Desktop 3-Column Layout (design.md Section 4.1 - visible only on lg+) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-start">
          {/* Kolom 1 (Sidebar Status & Prices) */}
          <div className="col-span-3 flex flex-col gap-3">
            <div className="bg-[#1C1E17] border border-[#262920] rounded-2xl p-4">
              <h4 className="font-outfit text-xs font-bold uppercase text-[#9C9884] mb-3">Harga Pasar Bursa</h4>
              <div className="space-y-2">
                {Object.keys(SECTOR_CONFIG).map(sec => (
                  <div key={sec} className="flex justify-between items-center text-xs">
                    <span className="font-inter font-semibold text-[#F4EFE2]">{sec}</span>
                    <span className="font-mono font-bold text-[#D4A24C]">{prices[sec]}🪙</span>
                  </div>
                ))}
              </div>
            </div>

            {renderLogBursaSection()}
          </div>

          {/* Kolom 2 (Action Board & Trading Floor Utama) */}
          <div className="col-span-9 flex flex-col gap-4">
            {phase === 'PREPARATION' && renderPreparationView()}
            {phase === 'BIDDING' && renderBiddingView()}
            {phase === 'ACTION' && renderActionView()}
            {phase === 'SELL' && renderSellView()}
            {phase === 'ECONOMY' && renderEconomyView()}

            {renderPortfolioSection()}
          </div>
        </div>

        {/* Mobile Layout (design.md Section 4.2 - visible on < lg) */}
        <div className="lg:hidden flex flex-col gap-4">
          {phase === 'PREPARATION' && renderPreparationView()}
          {phase === 'BIDDING' && renderBiddingView()}
          {phase === 'ECONOMY' && renderEconomyView()}

          {(phase === 'ACTION' || phase === 'SELL') && (
            <>
              {mobileTab === 'meja' && (
                <>
                  {phase === 'ACTION' ? renderActionView() : renderSellView()}
                </>
              )}
              {mobileTab === 'portofolio' && renderPortfolioSection()}
              {mobileTab === 'log' && renderLogBursaSection()}
            </>
          )}
        </div>
      </main>

      {/* 3. MOBILE BOTTOM TAB NAVIGATION (design.md Section 4.2) */}
      {(phase === 'ACTION' || phase === 'SELL') && (
        <nav className="fixed bottom-0 left-0 w-full z-40 bg-[#1C1E17] border-t border-[#262920] px-4 py-2 flex justify-around items-center lg:hidden">
          <button
            onClick={() => setMobileTab('meja')}
            className={`flex flex-col items-center py-1 px-4 rounded-xl transition-all ${
              mobileTab === 'meja' ? 'bg-[#E8622C] text-[#12130F] font-bold' : 'text-[#9C9884]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">view_carousel</span>
            <span className="font-outfit text-[10px] uppercase">Meja</span>
          </button>

          <button
            onClick={() => setMobileTab('portofolio')}
            className={`flex flex-col items-center py-1 px-4 rounded-xl transition-all ${
              mobileTab === 'portofolio' ? 'bg-[#E8622C] text-[#12130F] font-bold' : 'text-[#9C9884]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
            <span className="font-outfit text-[10px] uppercase">Portofolio</span>
          </button>

          <button
            onClick={() => setMobileTab('log')}
            className={`flex flex-col items-center py-1 px-4 rounded-xl transition-all relative ${
              mobileTab === 'log' ? 'bg-[#E8622C] text-[#12130F] font-bold' : 'text-[#9C9884]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">subtitles</span>
            <span className="font-outfit text-[10px] uppercase">Log Bursa</span>
          </button>
        </nav>
      )}

      {/* 4. BOTTOM SHEET DETAIL KARTU (Mobile & Desktop Modal) */}
      {showCardDetailModal && selectedCardIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowCardDetailModal(false)}></div>

          {/* Bottom Sheet Container */}
          {(() => {
            const card = actionBoard[selectedCardIndex];
            if (!card) return null;

            const theme = getSectorColorTheme(card.sector);
            const skillInfo = getSkillInfo(card.skillType);
            const price = prices[card.sector];

            let isSkillDisabled = false;
            let skillDisabledReason = '';

            if (card.skillType === 'quick_buy') {
              const otherNonNullCardsCount = actionBoard.filter((c, i) => c !== null && i !== selectedCardIndex).length;
              if (otherNonNullCardsCount < 2) {
                isSkillDisabled = true;
                skillDisabledReason = 'Butuh minimal 2 kartu lain di meja';
              }
            } else if (card.skillType === 'trading_fee') {
              const totalUserStocks = Object.keys(players.user.stocks).reduce((sum, key) => sum + players.user.stocks[key], 0) + players.user.mutualFunds;
              if (totalUserStocks === 0) {
                isSkillDisabled = true;
                skillDisabledReason = 'Anda tidak memiliki saham untuk dijual';
              }
            }

            return (
              <div className="relative bottom-sheet md:rounded-2xl w-full max-w-md p-5 flex flex-col gap-4 z-50 animate-slide-up md:animate-scale-up max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowCardDetailModal(false)}
                  className="absolute top-4 right-4 text-[#9C9884] hover:text-[#F4EFE2] bg-[#262920] rounded-full p-1"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>

                <div className="flex justify-center pt-2">
                  <div className="w-40 h-60 bg-[#12130F] p-2 rounded-2xl shadow-xl flex flex-col border border-[#262920]">
                    <div className={`rounded-xl flex-grow flex flex-col justify-between p-3 relative overflow-hidden bg-gradient-to-br ${theme.gradient} text-[#F4EFE2]`}>
                      <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-sm bg-black/30 p-1 rounded-full">
                          {SECTOR_CONFIG[card.sector].icon}
                        </span>
                        <span className="font-outfit font-black text-xs bg-black/40 px-2 py-0.5 rounded-full">
                          {price}🪙
                        </span>
                      </div>

                      <div className="w-20 h-20 bg-[#F4EFE2]/95 rounded-full rotate-[-15deg] flex items-center justify-center mx-auto my-auto">
                        <span className={`material-symbols-outlined text-4xl rotate-[15deg] ${theme.text}`}>
                          {SECTOR_CONFIG[card.sector].icon}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="font-outfit text-xs font-bold uppercase text-center">{card.name}</span>
                        <span className="text-[8px] bg-black/40 px-2 py-0.5 rounded-full uppercase mt-1">
                          {skillInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h4 className="font-outfit text-base font-bold text-[#F4EFE2]">Pilihan Aksi Kartu Hibrida</h4>
                  <p className="text-xs text-[#9C9884] leading-relaxed">
                    <strong>Opsi A (Beli Saham):</strong> Simpan kartu sebagai 1 unit saham {card.name} seharga <strong>{price}🪙</strong>.
                  </p>
                  <p className="text-xs text-[#9C9884] leading-relaxed border-t border-[#262920] pt-2">
                    <strong>Opsi B (Gunakan Skill):</strong> Aktifkan skill <strong>{skillInfo.label}</strong> secara gratis ({skillInfo.desc}) lalu buang kartu.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      store.buyStock('user', selectedCardIndex);
                      setShowCardDetailModal(false);
                    }}
                    className="w-full py-3 px-4 rounded-full bg-[#E8622C] hover:bg-[#E8622C]/90 text-[#12130F] font-outfit font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    Opsi A: Beli Saham ({price}🪙)
                  </button>

                  <button
                    disabled={isSkillDisabled}
                    onClick={() => {
                      setShowCardDetailModal(false);
                      if (card.skillType === 'rumor') {
                        store.useSkill('user', selectedCardIndex);
                      } else if (card.skillType === 'info') {
                        store.useSkill('user', selectedCardIndex);
                        handleOpenInfoBursa();
                      } else if (card.skillType === 'trading_fee') {
                        setSelectedSkillCardIndex(selectedCardIndex);
                        setShowTradingFeeModal(true);
                      } else if (card.skillType === 'akuisisi') {
                        setSelectedSkillCardIndex(selectedCardIndex);
                        setShowAkuisisiModal(true);
                      } else {
                        store.useSkill('user', selectedCardIndex);
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-full font-outfit font-bold text-xs uppercase flex items-center justify-center gap-1.5 ${
                      isSkillDisabled
                        ? 'bg-[#262920] text-[#9C9884] opacity-50 cursor-not-allowed'
                        : 'bg-[#D4A24C] hover:bg-[#D4A24C]/90 text-[#12130F]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{skillInfo.icon}</span>
                    Opsi B: Pakai {skillInfo.label}
                  </button>
                  {isSkillDisabled && (
                    <span className="text-[10px] text-[#C1453A] font-mono text-center">{skillDisabledReason}</span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* POP-UP STOCK SPLIT / CRASH (design.md Section 5.1) */}
      {lastEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-in"></div>
          <div className={`relative bg-[#1C1E17] rounded-2xl border p-6 shadow-2xl max-w-sm w-full text-center z-50 animate-scale-up border-${
            lastEvent.type === 'SPLIT' ? '[#D4A24C]' : '[#C1453A]'
          }`}>
            <span className={`material-symbols-outlined text-6xl mb-2 ${
              lastEvent.type === 'SPLIT' ? 'text-[#D4A24C]' : 'text-[#C1453A]'
            }`}>
              {lastEvent.type === 'SPLIT' ? 'call_split' : 'warning'}
            </span>
            <h3 className={`font-outfit text-xl font-black uppercase mb-2 ${
              lastEvent.type === 'SPLIT' ? 'text-[#D4A24C]' : 'text-[#C1453A]'
            }`}>
              {lastEvent.type === 'SPLIT' ? 'STOCK SPLIT!' : 'STOCK CRASH!'}
            </h3>
            <p className="text-xs text-[#9C9884] leading-relaxed mb-5 font-inter">
              {lastEvent.message}
            </p>
            <button
              onClick={() => store.clearLastEvent()}
              className={`w-full py-3 rounded-full font-outfit font-bold text-xs uppercase ${
                lastEvent.type === 'SPLIT' ? 'bg-[#D4A24C] text-[#12130F]' : 'bg-[#C1453A] text-[#F4EFE2]'
              }`}
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Info Bursa Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowInfoModal(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-sm w-full z-50 animate-scale-up">
            <h3 className="font-outfit text-base font-bold text-[#E8622C] uppercase border-b border-[#262920] pb-2 text-center">
              Hasil Info Bursa
            </h3>
            <div className="space-y-2 my-4">
              {infoBursaData.map((item, idx) => (
                <div key={idx} className="bg-[#262920] rounded-xl p-2.5 flex justify-between items-center text-xs">
                  <span className="font-outfit font-bold text-[#F4EFE2]">{item.sector}</span>
                  <span className="font-mono text-[#4A9B6E] font-bold">
                    {item.card.title} ({item.card.change ? (item.card.change > 0 ? `+${item.card.change}` : item.card.change) : item.card.type === 'general_up' ? '+1' : '-1'})
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 bg-[#262920] text-[#F4EFE2] font-outfit font-bold rounded-xl text-xs uppercase"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Trading Fee Modal */}
      {showTradingFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowTradingFeeModal(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-sm w-full z-50 animate-scale-up">
            <h3 className="font-outfit text-base font-bold text-[#E8622C] uppercase border-b border-[#262920] pb-2 text-center">
              Skill Trading Fee
            </h3>
            <p className="text-xs text-[#9C9884] my-3 text-center">
              Pilih sektor saham yang ingin dijual instan dengan fee 1 koin per lembar.
            </p>
            {!tradingFeeSector ? (
              <div className="grid grid-cols-2 gap-2 my-2">
                {Object.keys(players.user.stocks).filter(sec => players.user.stocks[sec] > 0).map(sec => (
                  <button
                    key={sec}
                    onClick={() => setTradingFeeSector(sec)}
                    className="bg-[#262920] hover:bg-[#E8622C]/20 border border-[#262920] p-2.5 rounded-xl font-outfit text-xs text-[#F4EFE2] font-bold"
                  >
                    {sec} ({players.user.stocks[sec]})
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3 my-2">
                <span className="font-outfit font-bold text-xs text-[#F4EFE2]">Sektor: {tradingFeeSector}</span>
                <input
                  type="range"
                  min="1"
                  max={players.user.stocks[tradingFeeSector]}
                  value={tradingFeeAmount}
                  onChange={(e) => setTradingFeeAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#12130F] rounded-lg accent-[#E8622C]"
                />
                <div className="text-xs font-mono text-[#4A9B6E] text-center">
                  Estimasi Koin: {(tradingFeeAmount * prices[tradingFeeSector]) - tradingFeeAmount}🪙
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTradingFeeSector(null)}
                    className="flex-1 py-2.5 bg-[#262920] text-[#F4EFE2] font-outfit rounded-xl text-xs"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => {
                      store.useSkill('user', selectedSkillCardIndex, { sector: tradingFeeSector, amount: tradingFeeAmount });
                      setShowTradingFeeModal(false);
                      setTradingFeeSector(null);
                    }}
                    className="flex-1 py-2.5 bg-[#E8622C] text-[#12130F] font-outfit font-bold rounded-xl text-xs"
                  >
                    Jual Sekarang
                  </button>
                </div>
              </div>
            )}
            {!tradingFeeSector && (
              <button
                onClick={() => setShowTradingFeeModal(false)}
                className="w-full py-2.5 bg-[#262920] text-[#F4EFE2] font-outfit rounded-xl text-xs mt-2"
              >
                Batal
              </button>
            )}
          </div>
        </div>
      )}

      {/* Akuisisi Modal */}
      {showAkuisisiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowAkuisisiModal(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-sm w-full z-50 animate-scale-up">
            <h3 className="font-outfit text-base font-bold text-[#E8622C] uppercase border-b border-[#262920] pb-2 text-center">
              Akuisisi Saham Target
            </h3>
            <p className="text-[11px] text-[#9C9884] my-2 text-center">
              Curi 1 saham milik Bot target jika jumlah saham Anda pada sektor tersebut $\ge$ target.
            </p>
            <div className="space-y-2 my-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#9C9884] mb-1">Target Player</label>
                <select
                  value={akuisisiTarget}
                  onChange={(e) => setAkuisisiTarget(e.target.value)}
                  className="w-full bg-[#12130F] border border-[#262920] rounded-xl p-2 text-xs text-[#F4EFE2]"
                >
                  <option value="bot1">Wira (AI Bot)</option>
                  <option value="bot2">Citra (AI Bot)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#9C9884] mb-1">Sektor Saham</label>
                <select
                  value={akuisisiSector}
                  onChange={(e) => setAkuisisiSector(e.target.value)}
                  className="w-full bg-[#12130F] border border-[#262920] rounded-xl p-2 text-xs text-[#F4EFE2]"
                >
                  <option value="Properti">Properti</option>
                  <option value="Infrastruktur">Infrastruktur</option>
                  <option value="Industri">Industri</option>
                  <option value="Consumer">Consumer</option>
                  <option value="ReksaDana">Reksa Dana</option>
                </select>
              </div>
            </div>

            {(() => {
              const userStocks = akuisisiSector === 'ReksaDana' ? players.user.mutualFunds : (players.user.stocks[akuisisiSector] || 0);
              const victimStocks = akuisisiSector === 'ReksaDana' ? players[akuisisiTarget].mutualFunds : (players[akuisisiTarget].stocks[akuisisiSector] || 0);
              const canAkuisisi = victimStocks > 0 && userStocks >= victimStocks;

              let errorMsg = '';
              if (victimStocks === 0) {
                errorMsg = `Target tidak memiliki saham ${akuisisiSector}`;
              } else if (userStocks < victimStocks) {
                errorMsg = `Saham Anda (${userStocks}) < target (${victimStocks})`;
              }

              return (
                <>
                  {errorMsg && (
                    <div className="text-[10px] text-[#C1453A] font-mono text-center bg-[#C1453A]/10 p-1.5 rounded-xl border border-[#C1453A]/30 mb-2">
                      {errorMsg}
                    </div>
                  )}
                  <button
                    disabled={!canAkuisisi}
                    onClick={() => {
                      store.useSkill('user', selectedSkillCardIndex, {
                        sector: akuisisiSector,
                        targetPlayer: akuisisiTarget
                      });
                      setShowAkuisisiModal(false);
                    }}
                    className={`w-full py-3 rounded-xl font-outfit text-xs font-bold uppercase ${
                      canAkuisisi ? 'bg-[#E8622C] text-[#12130F]' : 'bg-[#262920] text-[#9C9884] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Eksekusi Akuisisi
                  </button>
                </>
              );
            })()}

            <button
              onClick={() => setShowAkuisisiModal(false)}
              className="w-full py-2.5 bg-[#262920] text-[#F4EFE2] font-outfit rounded-xl text-xs mt-2"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={() => setShowExitConfirm(false)}></div>
          <div className="relative bg-[#1C1E17] rounded-2xl border border-[#262920] p-5 shadow-2xl max-w-sm w-full text-center z-50 animate-scale-up">
            <span className="material-symbols-outlined text-5xl text-[#C1453A] mb-2">warning</span>
            <h3 className="font-outfit text-base font-bold text-[#F4EFE2] uppercase border-b border-[#262920] pb-2">
              Keluar Permainan?
            </h3>
            <p className="text-xs text-[#9C9884] my-3 leading-relaxed">
              Apakah Anda yakin ingin keluar ke menu utama? Progres pertandingan saat ini akan hilang.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 bg-[#262920] text-[#F4EFE2] font-outfit rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  resetToHome();
                }}
                className="flex-1 py-2.5 bg-[#C1453A] text-[#F4EFE2] font-outfit font-bold rounded-xl text-xs uppercase"
              >
                Keluar Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

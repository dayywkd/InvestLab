import { create } from 'zustand';

// Konfigurasi Sektor Pasar
export const SECTOR_CONFIG = {
  Properti: { name: 'Properti', initialPrice: 5, minPrice: 2, maxPrice: 12, crashPrice: 4, color: 'text-blue-400', bg: 'bg-blue-500/20', icon: 'domain' },
  Infrastruktur: { name: 'Infrastruktur', initialPrice: 5, minPrice: 1, maxPrice: 15, crashPrice: 3, color: 'text-purple-400', bg: 'bg-purple-500/20', icon: 'construction' },
  Industri: { name: 'Industri', initialPrice: 5, minPrice: 1, maxPrice: 18, crashPrice: 2, color: 'text-orange-400', bg: 'bg-orange-500/20', icon: 'factory' },
  Consumer: { name: 'Consumer', initialPrice: 5, minPrice: 0, maxPrice: 20, crashPrice: 1, color: 'text-green-400', bg: 'bg-green-500/20', icon: 'shopping_cart' },
  ReksaDana: { name: 'Reksa Dana', initialPrice: 10, minPrice: 8, maxPrice: 18, color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: 'account_balance' }
};

// Pool Kartu Ekonomi per Sektor
const ECONOMY_POOLS = {
  Properti: [
    { title: 'Boom Properti', sector: 'Properti', change: 3, text: 'Pasar properti bergairah tinggi.', type: 'normal' },
    { title: 'Kenaikan Suku Bunga', sector: 'Properti', change: -2, text: 'Suku bunga KPR naik membuat pasar lesu.', type: 'normal' },
    { title: 'Program Rumah Nasional', sector: 'Properti', change: 2, text: 'Subsidi perumahan rakyat diresmikan.', bonusSector: 'Infrastruktur', bonusChange: 1, type: 'normal' },
    { title: 'Krisis Properti', sector: 'Properti', change: -3, text: 'Terjadi default massal pada kredit pemilikan rumah.', type: 'normal' },
    { title: 'Pertumbuhan Ekonomi', change: 1, text: 'Ekonomi tumbuh secara umum.', type: 'general_up' },
    { title: 'Stock Crash Properti', sector: 'Properti', text: 'Gelembung pasar properti pecah!', type: 'crash' },
    { title: 'Stock Split Properti', sector: 'Properti', text: 'Properti melakukan pemecahan nilai saham.', type: 'split' },
    { title: 'Resesi Global', change: -1, text: 'Ekonomi global mengalami kemunduran.', type: 'general_down' }
  ],
  Infrastruktur: [
    { title: 'Proyek Nasional', sector: 'Infrastruktur', change: 3, text: 'Pembangunan megaproyek pemerintah dimulai.', type: 'normal' },
    { title: 'Jalan Tol Baru', sector: 'Infrastruktur', change: 2, text: 'Tol trans-nasional selesai dibangun.', bonusSector: 'Properti', bonusChange: 1, type: 'normal' },
    { title: 'Pemotongan Anggaran', sector: 'Infrastruktur', change: -2, text: 'Anggaran belanja infrastruktur dipangkas.', type: 'normal' },
    { title: 'Bencana Alam', sector: 'Infrastruktur', change: -3, text: 'Kerusakan fasilitas umum akibat bencana.', type: 'normal' },
    { title: 'Pertumbuhan Ekonomi', change: 1, text: 'Ekonomi tumbuh secara umum.', type: 'general_up' },
    { title: 'Stock Crash Infrastruktur', sector: 'Infrastruktur', text: 'Proyek infrastruktur utama gagal total!', type: 'crash' },
    { title: 'Stock Split Infrastruktur', sector: 'Infrastruktur', text: 'Infrastruktur memecah harga sahamnya.', type: 'split' }
  ],
  Industri: [
    { title: 'Ekspansi Pabrik', sector: 'Industri', change: 3, text: 'Peningkatan kapasitas manufaktur nasional.', type: 'normal' },
    { title: 'Harga Energi Naik', sector: 'Industri', change: -2, text: 'Tarif listrik dan bahan bakar industri membubung.', type: 'normal' },
    { title: 'Peningkatan Ekspor', sector: 'Industri', change: 2, text: 'Permintaan manufaktur dari luar negeri melonjak.', type: 'normal' },
    { title: 'Gangguan Rantai Pasok', sector: 'Industri', change: -3, text: 'Kelangkaan bahan baku global menghambat produksi.', type: 'normal' },
    { title: 'Industrial Boom', sector: 'Industri', change: 2, text: 'Teknologi baru melipatgandakan efisiensi pabrik.', type: 'industrial_boom' },
    { title: 'Stock Crash Industri', sector: 'Industri', text: 'Krisis rantai pasok menghancurkan emiten industri!', type: 'crash' },
    { title: 'Stock Split Industri', sector: 'Industri', text: 'Industri melakukan stock split.', type: 'split' }
  ],
  Consumer: [
    { title: 'Musim Belanja', sector: 'Consumer', change: 3, text: 'Konsumsi rumah tangga melonjak tinggi.', type: 'normal' },
    { title: 'Hari Raya Nasional', sector: 'Consumer', change: 2, text: 'Belanja musiman hari raya melampaui target.', type: 'normal' },
    { title: 'Inflasi Tinggi', sector: 'Consumer', change: -2, text: 'Harga barang pokok melambung tinggi.', type: 'normal' },
    { title: 'Penurunan Daya Beli', sector: 'Consumer', change: -3, text: 'Masyarakat mengurangi belanja sekunder.', type: 'normal' },
    { title: 'Consumer Frenzy', sector: 'Consumer', change: 4, text: 'Euforia belanja barang impor.', type: 'consumer_frenzy' },
    { title: 'Stock Crash Consumer', sector: 'Consumer', text: 'Boikot produk konsumsi massal terjadi.', type: 'crash' },
    { title: 'Stock Split Consumer', sector: 'Consumer', text: 'Consumer melakukan stock split.', type: 'split' }
  ]
};

// Buat Dek Kartu Aksi Hibrida (Sektor + Skill acak)
const generateActionDeck = () => {
  const sectors = [
    ...Array(10).fill('Properti'),
    ...Array(10).fill('Infrastruktur'),
    ...Array(10).fill('Industri'),
    ...Array(10).fill('Consumer'),
    ...Array(5).fill('ReksaDana')
  ];
  const skills = shuffle([
    ...Array(9).fill('info'),
    ...Array(9).fill('rumor'),
    ...Array(9).fill('quick_buy'),
    ...Array(9).fill('trading_fee'),
    ...Array(9).fill('akuisisi')
  ]);

  const deck = [];
  for (let i = 0; i < sectors.length; i++) {
    const sector = sectors[i];
    const skillType = skills[i];
    let skillName = '';
    if (skillType === 'info') skillName = 'Info Bursa';
    else if (skillType === 'rumor') skillName = 'Rumor';
    else if (skillType === 'quick_buy') skillName = 'Quick Buy';
    else if (skillType === 'trading_fee') skillName = 'Trading Fee';
    else if (skillType === 'akuisisi') skillName = 'Akuisisi';

    deck.push({
      id: `${sector}_${skillType}_${i}`,
      name: sector === 'ReksaDana' ? 'Reksa Dana' : sector,
      type: 'hybrid',
      sector,
      skillType,
      skillName
    });
  }
  return shuffle(deck);
};

// Helper untuk mengacak array
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Buat Dek Ekonomi Berisi Tepat 6 Kartu per Sektor
const generateEconomyDecks = () => {
  return {
    Properti: shuffle(ECONOMY_POOLS.Properti).slice(0, 6),
    Infrastruktur: shuffle(ECONOMY_POOLS.Infrastruktur).slice(0, 6),
    Industri: shuffle(ECONOMY_POOLS.Industri).slice(0, 6),
    Consumer: shuffle(ECONOMY_POOLS.Consumer).slice(0, 6)
  };
};

const initialPlayerState = (name, isBot = false) => ({
  name,
  isBot,
  coins: 30,
  stocks: { Properti: 0, Infrastruktur: 0, Industri: 0, Consumer: 0 },
  mutualFunds: 0,
  debtCards: 0,
  currentBid: 0
});

const getInitialState = () => ({
  phase: 'SPLASH', // SPLASH, HOME, LOBBY, PREPARATION, BIDDING, ACTION, SELL, ECONOMY, GAMEOVER
  turn: 1, // Ronde 1 sampai 6
  userLevel: 1,
  userGlobalCoins: 5000,
  userExp: 0,
  prices: {
    Properti: 5,
    Infrastruktur: 5,
    Industri: 5,
    Consumer: 5,
    ReksaDana: 10
  },
  priceHistories: {
    Properti: [5],
    Infrastruktur: [5],
    Industri: [5],
    Consumer: [5],
    ReksaDana: [10]
  },
  players: {
    user: initialPlayerState('User (Anda)', false),
    bot1: initialPlayerState('Wira (Bot AI)', true),
    bot2: initialPlayerState('Citra (Bot AI)', true)
  },
  playOrder: ['user', 'bot1', 'bot2'], // Urutan jalan setelah Bidding
  activePlayerIndex: 0, // Indeks pemain yang sedang berjalan di Fase Aksi/Jual
  actionDeck: [], // Dek kartu aksi utama
  actionBoard: [], // 6 kartu terbuka di meja
  economyDecks: {}, // Dek kartu ekonomi per sektor
  activeEconomyCards: null, // Kartu ekonomi yang terbuka pada ronde berjalan
  industrialBoomActive: false, // Efek khusus Industri
  rumorCountRemaining: 0, // Sisa klik rumor untuk User
  rumorSelectedSector: null, // Sektor rumor terpilih
  logs: [], // Riwayat aksi game
  lastEvent: null // Event penting (Split/Crash) untuk notifikasi pop-up
});



export const useGameStore = create((set, get) => {
  // Simpan state ke localStorage
  const saveToLocalStorage = (state) => {
    try {
      localStorage.setItem('investlab_game_state', JSON.stringify(state));
    } catch (e) {
      console.error('Gagal menyimpan state ke localStorage', e);
    }
  };

  return {
    ...getInitialState(),

    // Sinkronisasi data ke Local Storage (No-Backend)
    syncUserData: async () => {
      const { userLevel, userGlobalCoins, userExp } = get();
      localStorage.setItem('investlab_user_profile', JSON.stringify({
        level: userLevel,
        globalCoins: userGlobalCoins,
        exp: userExp
      }));
    },

    // Ambil Data Leaderboard Lokal (No-Backend)
    fetchLeaderboard: async () => {
      try {
        let localLeaderboard = localStorage.getItem('investlab_leaderboard');
        if (!localLeaderboard) {
          const mockData = [
            { username: 'Citra (AI Bot)', level: 28, globalCoins: 25000 },
            { username: 'Rian (Pro Trader)', level: 24, globalCoins: 18500 },
            { username: 'Wira (AI Bot)', level: 15, globalCoins: 12000 },
            { username: 'User (Anda)', level: get().userLevel, globalCoins: get().userGlobalCoins },
            { username: 'Budi (Beginner)', level: 5, globalCoins: 3500 },
            { username: 'Siti (Saver)', level: 8, globalCoins: 2400 }
          ];
          localStorage.setItem('investlab_leaderboard', JSON.stringify(mockData));
          localLeaderboard = JSON.stringify(mockData);
        }

        const parsed = JSON.parse(localLeaderboard);
        const updated = parsed.map(item => {
          if (item.username === 'User (Anda)') {
            return {
              ...item,
              level: get().userLevel,
              globalCoins: get().userGlobalCoins
            };
          }
          return item;
        });

        updated.sort((a, b) => b.globalCoins - a.globalCoins);
        localStorage.setItem('investlab_leaderboard', JSON.stringify(updated));
        return updated;
      } catch (err) {
        console.error('Gagal mengambil leaderboard lokal:', err);
        return [];
      }
    },

    // Inisialisasi Game Baru
    initGame: () => {
      const freshState = {
        ...getInitialState(),
        phase: 'PREPARATION',
        actionDeck: generateActionDeck(),
        economyDecks: generateEconomyDecks(),
        logs: ['Permainan baru dimulai. Fase Persiapan harga saham dasar.']
      };
      set(freshState);
      saveToLocalStorage(freshState);
      get().syncUserData(); // Sinkronisasi profil saat mulai
    },

    // Memuat State dari localStorage
    loadGame: () => {
      // 1. Muat profil user dari localStorage
      try {
        const savedProfile = localStorage.getItem('investlab_user_profile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          set({
            userLevel: profile.level ?? 1,
            userGlobalCoins: profile.globalCoins ?? 5000,
            userExp: profile.exp ?? 0
          });
        }
      } catch (e) {
        console.error('Gagal memuat profil', e);
      }

      // 2. Muat game state berjalan
      try {
        const saved = localStorage.getItem('investlab_game_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed &&
            parsed.players &&
            parsed.prices &&
            parsed.phase &&
            parsed.playOrder &&
            parsed.actionBoard &&
            parsed.priceHistories &&
            parsed.players.user &&
            parsed.players.user.stocks) {
            
            // Overwrite level/coins dari profil terbaru
            const savedProfile = localStorage.getItem('investlab_user_profile');
            if (savedProfile) {
              const profile = JSON.parse(savedProfile);
              parsed.userLevel = profile.level ?? parsed.userLevel;
              parsed.userGlobalCoins = profile.globalCoins ?? parsed.userGlobalCoins;
              parsed.userExp = profile.exp ?? parsed.userExp;
            }
            
            set(parsed);
            return true;
          } else {
            console.warn('Skema state localStorage tidak cocok, mereset...');
            localStorage.removeItem('investlab_game_state');
          }
        }
      } catch (e) {
        console.error('Gagal memuat state dari localStorage', e);
        localStorage.removeItem('investlab_game_state');
      }
      return false;
    },

    // Mereset Game ke Menu Utama
    resetToHome: () => {
      localStorage.removeItem('investlab_game_state');
      set({ phase: 'HOME' });
    },

    // Menambah Log Aktivitas
    addLog: (message) => {
      set((state) => ({ logs: [message, ...state.logs].slice(0, 100) }));
    },

    // Pindah ke Fase Bidding
    startTrading: () => {
      const freshBoard = get().actionDeck.slice(0, 6);
      const remainingDeck = get().actionDeck.slice(6);
      set({
        phase: 'BIDDING',
        actionBoard: freshBoard,
        actionDeck: remainingDeck,
        logs: [`Ronde ${get().turn} dimulai. Silakan tentukan taruhan koin (Bid) Anda untuk menentukan urutan jalan.`].concat(get().logs)
      });
      get().save();
    },

    // Logika Pemotongan Koin & Penerimaan Utang
    adjustCoins: (playerKey, amount) => {
      set((state) => {
        const player = { ...state.players[playerKey] };
        let newCoins = player.coins + amount;
        let newDebt = player.debtCards;

        while (newCoins < 0) {
          newCoins += 10;
          newDebt += 1;
        }

        return {
          players: {
            ...state.players,
            [playerKey]: {
              ...player,
              coins: newCoins,
              debtCards: newDebt
            }
          }
        };
      });
    },

    // Pengiriman Bid oleh User
    submitUserBid: (bidValue) => {
      const { players } = get();
      // Validasi bidValue tidak boleh melebihi koin user (mencegah hutang di fase bidding)
      const finalBid = Math.min(bidValue, players.user.coins);

      set((state) => ({
        players: {
          ...state.players,
          user: { ...state.players.user, currentBid: finalBid }
        }
      }));

      // Jalankan Bid untuk Bot secara otomatis
      get().runBotBids();
    },

    // Menghasilkan Bid Acak untuk Bot AI
    runBotBids: () => {
      const { players } = get();

      const makeBotBid = (botKey) => {
        const bot = players[botKey];
        // AI bertaruh 10% - 30% dari sisa koinnya
        const minBid = 1;
        const maxBid = Math.max(1, Math.floor(bot.coins * 0.35));
        const bid = Math.floor(Math.random() * (maxBid - minBid + 1)) + minBid;

        set((state) => ({
          players: {
            ...state.players,
            [botKey]: { ...state.players[botKey], currentBid: bid }
          }
        }));
      };

      makeBotBid('bot1');
      makeBotBid('bot2');

      // Kalkulasi Urutan Jalan
      get().calculatePlayOrder();
    },

    // Mengalkulasi Urutan Jalan & Mengurangi Koin Sesuai Bid
    calculatePlayOrder: () => {
      const { players } = get();
      const userBid = players.user.currentBid;
      const bot1Bid = players.bot1.currentBid;
      const bot2Bid = players.bot2.currentBid;

      const bidList = [
        { key: 'user', bid: userBid },
        { key: 'bot1', bid: bot1Bid },
        { key: 'bot2', bid: bot2Bid }
      ];

      // Urutkan berdasarkan bid tertinggi. Jika sama, acak urutan.
      bidList.sort((a, b) => {
        if (b.bid !== a.bid) {
          return b.bid - a.bid;
        }
        return Math.random() - 0.5;
      });

      const newOrder = bidList.map(item => item.key);

      // Kurangi koin masing-masing pemain sebesar bid mereka
      newOrder.forEach(playerKey => {
        get().adjustCoins(playerKey, -players[playerKey].currentBid);
      });

      const orderNames = newOrder.map(k => players[k].name).join(' -> ');

      set({
        playOrder: newOrder,
        phase: 'ACTION',
        activePlayerIndex: 0,
        logs: [
          `Urutan jalan Ronde ${get().turn}: ${orderNames}`,
          `Taruhan selesai: User bid ${userBid}🪙, Wira bid ${bot1Bid}🪙, Citra bid ${bot2Bid}🪙. Koin bid masuk ke Bank.`
        ].concat(get().logs)
      });

      get().save();

      // Jika pemain pertama adalah Bot, jalankan gilirannya
      if (newOrder[0] !== 'user') {
        setTimeout(() => get().runBotAction(), 1200);
      }
    },

    // Aksi Mengambil Kartu (Opsi A: Beli Saham)
    buyStock: (playerKey, cardIndex) => {
      const { actionBoard, prices } = get();
      const card = actionBoard[cardIndex];

      if (!card) return;

      const sector = card.sector;
      const price = prices[sector];

      // Potong koin (jika koin tidak cukup, otomatis ambil utang via adjustCoins)
      get().adjustCoins(playerKey, -price);

      // Tambahkan aset ke portofolio
      set((state) => {
        const p = { ...state.players[playerKey] };

        if (sector === 'ReksaDana') {
          p.mutualFunds += 1;
        } else {
          p.stocks = {
            ...p.stocks,
            [sector]: p.stocks[sector] + 1
          };
        }

        // Hapus kartu dari meja dan isi null
        const newBoard = [...state.actionBoard];
        newBoard[cardIndex] = null;

        return {
          players: {
            ...state.players,
            [playerKey]: p
          },
          actionBoard: newBoard,
          logs: [`${p.name} menyimpan ${card.name} sebagai saham seharga ${price}🪙.`].concat(state.logs)
        };
      });

      get().save();
      get().nextPlayerAction();
    },

    // Aksi Menggunakan Kartu Skill (Opsi B: Pakai Skill)
    useSkill: (playerKey, cardIndex, skillData = {}) => {
      const { actionBoard, players } = get();
      const card = actionBoard[cardIndex];
      const player = players[playerKey];

      if (!card) return;

      const skill = card.skillType;

      // Hapus kartu dari meja terlebih dahulu
      set((state) => {
        const newBoard = [...state.actionBoard];
        newBoard[cardIndex] = null;
        return { actionBoard: newBoard };
      });

      if (skill === 'info') {
        // Skill: Info Bursa -> Intip indeks 0 dari 2 sektor bursa teratas + koin +2
        get().adjustCoins(playerKey, 2);

        get().getInfoBursaDetails();
        set((state) => ({
          logs: [
            `${players[playerKey].name} menggunakan Skill Info Bursa: intip masa depan sektor & memperoleh +2🪙 dari Bank.`
          ].concat(state.logs)
        }));
      }

      else if (skill === 'rumor') {
        // Skill: Rumor -> Ubah harga sektor +-1 (maksimal 2x klik/pilihan)
        if (player.isBot) {
          const sectors = ['Properti', 'Infrastruktur', 'Industri', 'Consumer'];
          const targetSector = sectors[Math.floor(Math.random() * sectors.length)];
          const direction = Math.random() > 0.5 ? 1 : -1;
          get().adjustPrice(targetSector, direction);
          get().adjustPrice(targetSector, direction); // total 2x perubahan
          set((state) => ({
            logs: [`${player.name} menggunakan Skill Rumor untuk mengubah harga ${targetSector} sebesar ${direction * 2}.`].concat(state.logs)
          }));
        } else {
          // User: set status rumor aktif untuk interaksi UI
          set({
            rumorCountRemaining: 2,
            rumorSelectedSector: null
          });
          // Jangan panggil nextPlayerAction dahulu, tunggu User selesai berinteraksi
          return;
        }
      }

      else if (skill === 'quick_buy') {
        // Skill: Quick Buy -> Ambil 2 kartu dari Action Board secara gratis -> paksa end turn pemain
        const { actionBoard: currentBoard } = get();
        const availableCards = [];
        currentBoard.forEach((c, idx) => {
          if (c !== null) {
            availableCards.push({ card: c, index: idx });
          }
        });

        if (availableCards.length < 2) {
          get().addLog(`${players[playerKey].name} mencoba memakai Quick Buy tetapi tidak ada cukup kartu di meja.`);
          get().save();
          get().nextPlayerAction();
          return;
        }

        const target1 = availableCards[0];
        const target2 = availableCards[1];

        set((state) => {
          const updatedPlayers = JSON.parse(JSON.stringify(state.players));
          const p = updatedPlayers[playerKey];
          const newBoard = [...state.actionBoard];

          newBoard[target1.index] = null;
          newBoard[target2.index] = null;

          [target1.card, target2.card].forEach(c => {
            if (c.sector === 'ReksaDana') {
              p.mutualFunds += 1;
            } else {
              p.stocks[c.sector] = (p.stocks[c.sector] || 0) + 1;
            }
          });

          return {
            players: updatedPlayers,
            actionBoard: newBoard,
            logs: [
              `${p.name} menggunakan Skill Quick Buy: menarik gratis 2 saham dari meja (${target1.card.name}, ${target2.card.name}) dan mengakhiri gilirannya.`
            ].concat(state.logs)
          };
        });

        get().save();

        const boardIsEmpty = get().actionBoard.every(c => c === null);
        if (boardIsEmpty) {
          set({ phase: 'SELL', activePlayerIndex: 0 });
          get().addLog('Meja aksi kosong. Fase Aksi selesai awal. Memasuki Fase 3: Jual Saham.');
          get().save();

          const { playOrder } = get();
          const firstPlayerKey = playOrder[0];
          if (firstPlayerKey !== 'user') {
            setTimeout(() => get().runBotSell(), 1000);
          }
        } else {
          get().nextPlayerAction();
        }
        return;
      }

      else if (skill === 'trading_fee') {
        // Skill: Trading Fee -> Potong 1 koin/lembar untuk menjual instan unit saham sektor tertentu
        const sector = skillData.sector || get().getBotBestSectorToSell(playerKey);
        const userStocks = sector === 'ReksaDana' ? player.mutualFunds : (player.stocks[sector] || 0);
        const amountToSell = skillData.amount || userStocks; // Gunakan jumlah spesifik jika ada

        if (amountToSell > 0) {
          const price = get().prices[sector];
          const fee = amountToSell * 1;
          const revenue = (amountToSell * price) - fee;

          // Hapus saham sesuai jumlah
          set((state) => {
            const updatedPlayers = JSON.parse(JSON.stringify(state.players));
            if (sector === 'ReksaDana') {
              updatedPlayers[playerKey].mutualFunds -= amountToSell;
            } else {
              updatedPlayers[playerKey].stocks[sector] -= amountToSell;
            }
            return { players: updatedPlayers };
          });

          get().adjustCoins(playerKey, revenue);

          set((state) => ({
            logs: [
              `${players[playerKey].name} menggunakan Skill Trading Fee: menjual ${amountToSell} unit saham ${sector} dengan biaya fee ${fee}🪙, memperoleh bersih +${revenue}🪙.`
            ].concat(state.logs)
          }));
        } else {
          set((state) => ({
            logs: [`${player.name} menggunakan Skill Trading Fee tetapi tidak memiliki saham ${sector} untuk dijual.`].concat(state.logs)
          }));
        }
      }

      else if (skill === 'akuisisi') {
        // Skill: Akuisisi -> Syarat saham sektor terpilih milik User >= Bot target
        const targetBotKey = skillData.targetPlayer || (playerKey === 'user' ? 'bot1' : 'user');
        const sector = skillData.sector || 'Properti';

        const curer = player;
        const victim = get().players[targetBotKey];

        const curerStocks = sector === 'ReksaDana' ? curer.mutualFunds : (curer.stocks[sector] || 0);
        const victimStocks = sector === 'ReksaDana' ? victim.mutualFunds : (victim.stocks[sector] || 0);

        if (victimStocks > 0 && curerStocks >= victimStocks) {
          // Lakukan pencurian
          set((state) => {
            const updatedPlayers = JSON.parse(JSON.stringify(state.players));
            if (sector === 'ReksaDana') {
              updatedPlayers[playerKey].mutualFunds += 1;
              updatedPlayers[targetBotKey].mutualFunds -= 1;
            } else {
              updatedPlayers[playerKey].stocks[sector] += 1;
              updatedPlayers[targetBotKey].stocks[sector] -= 1;
            }
            return { players: updatedPlayers };
          });

          // Bank membayar korban
          const price = get().prices[sector];
          get().adjustCoins(targetBotKey, price);

          set((state) => ({
            logs: [
              `${curer.name} melakukan Akuisisi saham ${sector === 'ReksaDana' ? 'Reksa Dana' : sector} milik ${victim.name}. Bank membayar ganti rugi ${price}🪙 kepada ${victim.name}.`
            ].concat(state.logs)
          }));
        } else {
          let reason = "syarat tidak terpenuhi";
          if (victimStocks === 0) {
            reason = `${victim.name} tidak memiliki saham ${sector === 'ReksaDana' ? 'Reksa Dana' : sector}`;
          } else if (curerStocks < victimStocks) {
            reason = `jumlah saham ${sector === 'ReksaDana' ? 'Reksa Dana' : sector} Anda (${curerStocks}) lebih sedikit daripada milik ${victim.name} (${victimStocks})`;
          }
          set((state) => ({
            logs: [
              `${curer.name} mencoba menggunakan Akuisisi saham ${sector === 'ReksaDana' ? 'Reksa Dana' : sector} kepada ${victim.name} tetapi gagal (${reason}).`
            ].concat(state.logs)
          }));
        }
      }

      get().save();
      get().nextPlayerAction();
    },

    // Finalisasi Skill Rumor yang dilakukan oleh User
    completeUserRumor: (sector, direction) => {
      get().adjustPrice(sector, direction);
      set((state) => {
        const remaining = state.rumorCountRemaining - 1;
        const logs = [`User menggunakan Rumor untuk mengubah harga ${sector} sebesar ${direction > 0 ? '+1' : '-1'}.`].concat(state.logs);

        if (remaining <= 0) {
          // Selesai rumor, lanjut giliran pemain berikutnya
          setTimeout(() => get().nextPlayerAction(), 600);
          return { rumorCountRemaining: 0, logs };
        }
        return { rumorCountRemaining: remaining, logs };
      });
      get().save();
    },

    // Mengintip Info Bursa
    getInfoBursaDetails: () => {
      const { economyDecks } = get();
      const details = [];
      const sectors = ['Properti', 'Infrastruktur', 'Industri', 'Consumer'];

      // Ambil kartu teratas dari 2 sektor bursa pertama yang masih memiliki kartu
      let count = 0;
      for (let s of sectors) {
        const deck = economyDecks[s];
        if (deck && deck.length > 0) {
          details.push({
            sector: s,
            card: deck[0]
          });
          count++;
          if (count >= 2) break;
        }
      }
      return details;
    },

    // Mengetahui Sektor Terbaik untuk Dijual Bot AI
    getBotBestSectorToSell: (botKey) => {
      const { stocks, mutualFunds } = get().players[botKey];
      const { prices } = get();
      let bestSector = 'Properti';
      let maxRevenue = 0;

      Object.keys(stocks).forEach(sector => {
        const rev = stocks[sector] * prices[sector];
        if (rev > maxRevenue) {
          maxRevenue = rev;
          bestSector = sector;
        }
      });

      const mfRev = mutualFunds * prices['ReksaDana'];
      if (mfRev > maxRevenue) {
        bestSector = 'ReksaDana';
      }
      return bestSector;
    },

    // Mengatur Pergeseran Giliran di Fase Aksi
    nextPlayerAction: () => {
      const { playOrder, activePlayerIndex } = get();

      // Jika pemain terakhir di urutan jalan selesai bertindak
      if (activePlayerIndex === playOrder.length - 1) {
        set({ phase: 'SELL', activePlayerIndex: 0 });
        get().addLog('Semua pemain selesai mengambil kartu aksi. Memasuki Fase 3: Jual Saham.');
        get().save();

        // Pemicu otomatis Jual jika urutan pertama adalah Bot
        const firstPlayerKey = playOrder[0];
        if (firstPlayerKey !== 'user') {
          setTimeout(() => get().runBotSell(), 1000);
        }
        return;
      }

      // Lanjut ke pemain berikutnya
      const nextIndex = activePlayerIndex + 1;
      set({ activePlayerIndex: nextIndex });

      const nextPlayerKey = playOrder[nextIndex];
      if (nextPlayerKey !== 'user') {
        setTimeout(() => get().runBotAction(), 1000);
      }
    },

    // Logika Pengambilan Keputusan AI di Fase Aksi
    runBotAction: () => {
      const { playOrder, activePlayerIndex, actionBoard, prices, players } = get();
      const botKey = playOrder[activePlayerIndex];
      const bot = players[botKey];

      if (!bot.isBot) return;

      // Cari indeks kartu yang masih ada di meja
      const availableIndices = [];
      actionBoard.forEach((c, idx) => {
        if (c !== null) availableIndices.push(idx);
      });

      if (availableIndices.length === 0) {
        get().nextPlayerAction();
        return;
      }

      // Pilihan Keputusan Bot AI:
      // 1. Jika ada kartu dengan skill Quick Buy, gunakan jika koin Bot sedikit (< 10) DAN sisa kartu di board >= 3 (termasuk Quick Buy)
      const quickBuyIndex = availableIndices.find(idx => actionBoard[idx].skillType === 'quick_buy');
      if (quickBuyIndex !== undefined && bot.coins < 10 && availableIndices.length >= 3) {
        get().useSkill(botKey, quickBuyIndex);
        return;
      }

      // 2. Evaluasi kartu saham yang harganya murah (<= 6 koin) dan Bot punya koin cukup
      const cheapStockIndex = availableIndices.find(idx => {
        const c = actionBoard[idx];
        return prices[c.sector] <= 6 && bot.coins >= prices[c.sector];
      });

      if (cheapStockIndex !== undefined) {
        get().buyStock(botKey, cheapStockIndex);
        return;
      }

      // 3. Jika ada skill Trading Fee dan Bot punya banyak saham di sektor harga tinggi
      const tradingFeeIndex = availableIndices.find(idx => actionBoard[idx].skillType === 'trading_fee');
      if (tradingFeeIndex !== undefined) {
        const bestSector = get().getBotBestSectorToSell(botKey);
        const count = bestSector === 'ReksaDana' ? bot.mutualFunds : bot.stocks[bestSector];
        if (count >= 2 && prices[bestSector] >= 8) {
          get().useSkill(botKey, tradingFeeIndex, { sector: bestSector });
          return;
        }
      }

      // 4. Fallback: pilih secara acak dari meja
      const randIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      const chosenCard = actionBoard[randIdx];

      // Acak keputusan: 50% beli saham (Opsi A), 50% pakai skill (Opsi B)
      const chooseSkill = Math.random() > 0.5;

      if (chooseSkill) {
        const skill = chosenCard.skillType;
        if (skill === 'quick_buy' && availableIndices.length < 3) {
          get().buyStock(botKey, randIdx);
        } else if (skill === 'trading_fee') {
          const bestSector = get().getBotBestSectorToSell(botKey);
          const count = bestSector === 'ReksaDana' ? bot.mutualFunds : bot.stocks[bestSector];
          if (count > 0) {
            get().useSkill(botKey, randIdx, { sector: bestSector });
          } else {
            get().buyStock(botKey, randIdx);
          }
        } else if (skill === 'akuisisi') {
          const sectors = ['Properti', 'Infrastruktur', 'Industri', 'Consumer', 'ReksaDana'];
          let success = false;
          
          for (let sec of sectors) {
            const botStocks = sec === 'ReksaDana' ? bot.mutualFunds : bot.stocks[sec];
            if (botStocks > 0) {
              const targets = Object.keys(players).filter(k => k !== botKey);
              for (let t of targets) {
                const targetStocks = sec === 'ReksaDana' ? players[t].mutualFunds : players[t].stocks[sec];
                if (targetStocks > 0 && botStocks >= targetStocks) {
                  get().useSkill(botKey, randIdx, { sector: sec, targetPlayer: t });
                  success = true;
                  break;
                }
              }
            }
            if (success) break;
          }
          if (!success) {
            get().buyStock(botKey, randIdx);
          }
        } else {
          get().useSkill(botKey, randIdx);
        }
      } else {
        get().buyStock(botKey, randIdx);
      }
    },

    // Aksi Jual Saham oleh Pemain
    sellStock: (playerKey, sector, amount = null) => {
      const { players, prices } = get();
      const player = players[playerKey];
      const count = sector === 'ReksaDana' ? player.mutualFunds : (player.stocks[sector] || 0);
      const amountToSell = amount || count; // Jual sejumlah unit atau semua

      if (amountToSell <= 0 || amountToSell > count) return;

      const price = prices[sector];
      const revenue = amountToSell * price;

      set((state) => {
        const updatedPlayers = JSON.parse(JSON.stringify(state.players));
        if (sector === 'ReksaDana') {
          updatedPlayers[playerKey].mutualFunds -= amountToSell;
        } else {
          updatedPlayers[playerKey].stocks[sector] -= amountToSell;
        }
        return { players: updatedPlayers };
      });

      get().adjustCoins(playerKey, revenue);

      set((state) => ({
        logs: [`${player.name} menjual ${amountToSell} lembar saham ${sector} seharga ${revenue}🪙.`].concat(state.logs)
      }));

      get().save();
      // Pemain bisa menjual lagi, tidak otomatis nextPlayerSell()
    },

    // Pemain Melewati Giliran Jual Saham (Pass)
    passSell: (playerKey) => {
      const { players } = get();
      set((state) => ({
        logs: [`${players[playerKey].name} selesai/melewati fase jual saham.`].concat(state.logs)
      }));
      get().nextPlayerSell();
    },

    // Pergeseran Giliran di Fase Jual Saham
    nextPlayerSell: () => {
      const { playOrder, activePlayerIndex } = get();
      const nextIndex = activePlayerIndex + 1;

      if (nextIndex >= playOrder.length) {
        // Semua pemain sudah menyelesaikan Fase Jual -> Beralih ke Fase 4: Ekonomi
        set({ phase: 'ECONOMY' });
        get().addLog('Fase penjualan selesai. Memasuki Fase 4: Buka Kartu Ekonomi Sektor.');
        get().save();

        // Buka kartu ekonomi bursa
        setTimeout(() => get().triggerEconomyReveal(), 1500);
        return;
      }

      set({ activePlayerIndex: nextIndex });

      const nextPlayerKey = playOrder[nextIndex];
      if (nextPlayerKey !== 'user') {
        setTimeout(() => get().runBotSell(), 1000);
      }
    },

    // Logika Penjualan Saham oleh Bot AI
    runBotSell: () => {
      const { playOrder, activePlayerIndex, players, prices } = get();
      const botKey = playOrder[activePlayerIndex];
      const bot = players[botKey];

      if (!bot.isBot) return;

      // Keputusan Jual Bot AI:
      // Jual saham jika harga sektor saat ini >= 12 dan Bot memiliki setidaknya 1 saham di sektor tersebut
      const sectorsToSell = Object.keys(bot.stocks).filter(sector => {
        return bot.stocks[sector] > 0 && prices[sector] >= 12;
      });
      if (bot.mutualFunds > 0 && prices.ReksaDana >= 12) {
        sectorsToSell.push('ReksaDana');
      }

      if (sectorsToSell.length > 0) {
        // AI menjual semua saham yang menguntungkan sekaligus
        sectorsToSell.forEach(sector => {
          get().sellStock(botKey, sector);
        });
        // Setelah semua dijual, bot selesai giliran
        get().passSell(botKey);
      } else {
        // AI memilih Pass jika harga pasar dinilai kurang tinggi
        get().passSell(botKey);
      }
    },

    // Pengubahan Harga Sektor dengan Batasan Min/Max
    adjustPrice: (sector, delta) => {
      const { prices } = get();
      const config = SECTOR_CONFIG[sector];
      if (!config) return;

      let newPrice = prices[sector] + delta;

      // Cek Batasan Sektor Properti (Pasar Jenuh)
      if (sector === 'Properti' && newPrice > config.maxPrice) {
        newPrice = config.maxPrice;
        get().addLog('Sektor Properti mencapai Pasar Jenuh: Harga tertahan di 12.');
      }
      // Cek Batasan Consumer Frenzy
      else if (sector === 'Consumer' && newPrice > config.maxPrice) {
        newPrice = config.maxPrice;
      }
      // Batasi dengan min dan max standard
      else {
        newPrice = Math.max(config.minPrice, Math.min(config.maxPrice, newPrice));
      }

      set((state) => ({
        prices: { ...state.prices, [sector]: newPrice },
        priceHistories: {
          ...state.priceHistories,
          [sector]: [...state.priceHistories[sector], newPrice]
        }
      }));
    },

    // Evaluasi Efek Khusus Sektor saat mencapai Batas Maksimum (Split/Kondisi Khusus)
    evaluateTopBoundSpecialEffects: (sector, targetPrice) => {
      const config = SECTOR_CONFIG[sector];
      if (targetPrice >= config.maxPrice) {
        if (sector === 'Infrastruktur') {
          // Efek Mega Project: Bonus +1 koin untuk setiap unit saham Infrastruktur yang dimiliki
          set((state) => {
            const updatedPlayers = JSON.parse(JSON.stringify(state.players));
            let logMsg = 'Efek Mega Project Infrastruktur dipicu! ';

            Object.keys(updatedPlayers).forEach(k => {
              const count = updatedPlayers[k].stocks.Infrastruktur || 0;
              if (count > 0) {
                updatedPlayers[k].coins += count;
                logMsg += `${updatedPlayers[k].name} mendapat +${count}🪙. `;
              }
            });

            return {
              players: updatedPlayers,
              logs: [logMsg].concat(state.logs)
            };
          });
        }

        else if (sector === 'Industri') {
          // Efek Industrial Boom: Ronde berikutnya semua kenaikan Industri mendapat +1 tambahan
          set({
            industrialBoomActive: true,
            logs: ['Efek Industrial Boom diaktifkan: Kenaikan harga Industri ronde berikutnya mendapat +1 tambahan.'].concat(get().logs)
          });
        }
      }
    },

    // Trigger Fase 4: Pembukaan Kartu Ekonomi Sektor
    triggerEconomyReveal: () => {
      const { economyDecks } = get();
      const activeCards = {};
      const changes = { Properti: 0, Infrastruktur: 0, Industri: 0, Consumer: 0 };
      let lastEvent = null;

      // 1. Tarik kartu ekonomi teratas dari 4 dek sektor
      const updatedDecks = { ...economyDecks };
      Object.keys(ECONOMY_POOLS).forEach(sector => {
        const deck = economyDecks[sector];
        if (deck && deck.length > 0) {
          activeCards[sector] = deck[0];
          updatedDecks[sector] = deck.slice(1);
        }
      });

      // 2. Kalkulasi pergeseran harga berdasarkan kartu ekonomi
      Object.keys(activeCards).forEach(sector => {
        const card = activeCards[sector];
        if (!card) return;

        if (card.type === 'normal') {
          changes[sector] += card.change;
          if (card.bonusSector) {
            changes[card.bonusSector] += card.bonusChange;
          }
        } else if (card.type === 'general_up') {
          // Semua sektor naik +1
          ['Properti', 'Infrastruktur', 'Industri', 'Consumer'].forEach(s => {
            changes[s] += 1;
          });
        } else if (card.type === 'general_down') {
          // Semua sektor turun -1
          ['Properti', 'Infrastruktur', 'Industri', 'Consumer'].forEach(s => {
            changes[s] -= 1;
          });
        } else if (card.type === 'industrial_boom') {
          changes.Industri += card.change;
        } else if (card.type === 'consumer_frenzy') {
          changes.Consumer += card.change;
        }
      });

      // Aplikasikan efek Industrial Boom dari ronde sebelumnya
      if (get().industrialBoomActive) {
        if (changes.Industri > 0) {
          changes.Industri += 1;
          get().addLog('Kenaikan sektor Industri mendapat bonus +1 dari efek Industrial Boom ronde lalu.');
        }
        // Matikan setelah digunakan
        set({ industrialBoomActive: false });
      }

      // 3. Update harga awal bursa berdasarkan pergeseran
      Object.keys(changes).forEach(sector => {
        get().adjustPrice(sector, changes[sector]);
      });

      // 4. Hitung fluktuasi acak untuk Reksa Dana (+-1 atau +2)
      const rfDelta = [1, 2, -1, 0][Math.floor(Math.random() * 4)];
      get().adjustPrice('ReksaDana', rfDelta);

      // 5. Evaluasi Kenaikan Sektor atas Efek Khusus & Split/Crash
      const currentPrices = get().prices;
      const splitSectors = [];
      const crashSectors = [];

      Object.keys(ECONOMY_POOLS).forEach(sector => {
        const config = SECTOR_CONFIG[sector];
        const price = currentPrices[sector];

        // Cek Split (jika menyentuh batas atas harga pasar)
        if (price >= config.maxPrice) {
          splitSectors.push(sector);
          // Jalankan efek khusus batas atas
          get().evaluateTopBoundSpecialEffects(sector, price);
        }

        // Cek Crash (jika menyentuh batas bawah / crash)
        if (price <= config.minPrice) {
          crashSectors.push(sector);
        }
      });

      // Eksekusi Stock Split
      splitSectors.forEach(sector => {
        const config = SECTOR_CONFIG[sector];
        const halfPrice = Math.floor(config.maxPrice / 2);

        // Set harga menjadi setengahnya
        set((state) => ({
          prices: { ...state.prices, [sector]: halfPrice },
          priceHistories: {
            ...state.priceHistories,
            [sector]: [...state.priceHistories[sector], halfPrice]
          }
        }));

        // Lipatgandakan saham pemain
        set((state) => {
          const updatedPlayers = JSON.parse(JSON.stringify(state.players));
          Object.keys(updatedPlayers).forEach(k => {
            updatedPlayers[k].stocks[sector] *= 2;
          });
          return { players: updatedPlayers };
        });

        lastEvent = { type: 'split', sector };
        get().addLog(`Krisis Terjadi: Stock Split sektor ${sector}! Harga dibagi dua menjadi ${halfPrice} dan jumlah lembar saham pemain dikali dua.`);
      });

      // Eksekusi Stock Crash
      crashSectors.forEach(sector => {
        const config = SECTOR_CONFIG[sector];

        // Reset harga ke harga dasar crash
        set((state) => ({
          prices: { ...state.prices, [sector]: config.crashPrice },
          priceHistories: {
            ...state.priceHistories,
            [sector]: [...state.priceHistories[sector], config.crashPrice]
          }
        }));

        // Hanguskan saham pemain (menjadi 0)
        set((state) => {
          const updatedPlayers = JSON.parse(JSON.stringify(state.players));
          Object.keys(updatedPlayers).forEach(k => {
            updatedPlayers[k].stocks[sector] = 0;
          });
          return { players: updatedPlayers };
        });

        lastEvent = { type: 'crash', sector };
        get().addLog(`Krisis Terjadi: Stock Crash sektor ${sector}! Harga jatuh di bawah batas minimum. Seluruh saham pemain hangus dan harga di-reset ke ${config.crashPrice}.`);
      });

      // Khusus Consumer Frenzy batas koreksi
      if (currentPrices.Consumer >= 20) {
        // Setelah ronde berakhir, Consumer otomatis turun 3
        setTimeout(() => {
          get().adjustPrice('Consumer', -3);
          get().addLog('Consumer Frenzy berakhir: koreksi otomatis harga Consumer turun 3.');
        }, 1000);
      }

      set({
        economyDecks: updatedDecks,
        activeEconomyCards: activeCards,
        lastEvent
      });

      get().save();
    },

    // Menyelesaikan Fase Ekonomi, Lanjut ke Turn berikutnya atau Selesai
    completeEconomyPhase: () => {
      const currentTurn = get().turn;
      set({ lastEvent: null, activeEconomyCards: null });

      if (currentTurn >= 6) {
        // Ronde 6 Selesai -> Game Over & Likuidasi Otomatis
        get().liquidateAllStocks();
      } else {
        // Ronde Baru
        set({
          turn: currentTurn + 1,
          phase: 'PREPARATION',
          logs: [`Ronde ${currentTurn + 1} dimulai. Fase Persiapan harga saham.`].concat(get().logs)
        });
        get().save();
      }
    },

    // Likuidasi Otomatis Semua Sisa Saham di Portofolio Pemain
    liquidateAllStocks: () => {
      const { players, prices } = get();
      const finalPlayers = { ...players };

      Object.keys(finalPlayers).forEach(k => {
        const player = finalPlayers[k];
        let totalRevenue = 0;

        // Likuidasi Saham Sektor
        Object.keys(player.stocks).forEach(sector => {
          const count = player.stocks[sector];
          const price = prices[sector];
          totalRevenue += count * price;
          player.stocks[sector] = 0;
        });

        // Likuidasi Reksa Dana
        const mfCount = player.mutualFunds;
        totalRevenue += mfCount * prices.ReksaDana;
        player.mutualFunds = 0;

        // Tambahkan koin hasil likuidasi
        player.coins += totalRevenue;

        // Hitung denda utang: denda -15 koin per unit utang
        const debtPenalty = player.debtCards * 15;
        player.coins -= debtPenalty;

        // Catat net worth akhir
        player.netWorth = Math.max(0, player.coins);
      });

      set({
        players: finalPlayers,
        phase: 'GAMEOVER',
        logs: ['Permainan Selesai. Likuidasi seluruh sisa saham portofolio dan penalti utang dihitung.'].concat(get().logs)
      });

      // Berikan reward ke akun global user (misal: 10% dari netWorth game dikonversi ke koin global)
      const userNetWorth = finalPlayers.user.netWorth || 0;
      const coinReward = Math.floor(userNetWorth * 100); // 1 koin game = 100 koin global
      const expReward = Math.floor(userNetWorth * 5);

      set((state) => {
        let newExp = state.userExp + expReward;
        let newLevel = state.userLevel;
        // Sistem Level Up sederhana: tiap 1000 EXP naik 1 level
        while (newExp >= 1000) {
          newExp -= 1000;
          newLevel += 1;
        }

        const newState = {
          userGlobalCoins: state.userGlobalCoins + coinReward,
          userLevel: newLevel,
          userExp: newExp
        };

        // Panggil sync secara async
        setTimeout(() => get().syncUserData(), 100);

        return newState;
      });

      // Bersihkan penyimpanan lokal setelah selesai agar tidak me-resume game yang sudah tamat
      localStorage.removeItem('investlab_game_state');
    },

    // Menyimpan State ke Local Storage
    save: () => {
      saveToLocalStorage(get());
    }
  };
});

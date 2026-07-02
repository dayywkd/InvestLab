# 📈 InvestLab - Capital Market Simulation Game

**InvestLab** adalah game simulasi bursa efek dan transaksi pasar modal berbasis kartu hibrida. Pemain akan bersaing melawan dua bot AI (**Wira** dan **Citra**) untuk membangun kekayaan bersih (*Net Worth*) tertinggi melalui 6 ronde permainan yang penuh strategi, fluktuasi pasar, dan manipulasi informasi.

---

## 🌟 Fitur Utama

1. **Terminal Bursa Real-Time (Aesthetika Premium)**
   * Desain visual bertema *dark market terminal* yang premium dengan ikon koin emas berkilau berbasis kustom SVG.
   * Dilengkapi loader candlestick chart yang dinamis dan tipografi modern (**Outfit**, **Inter**, dan **JetBrains Mono**).
2. **Sistem Turn-Based 4 Fase Permainan**
   * **Fase 1: Persiapan**: Sinkronisasi harga awal untuk sektor Properti, Infrastruktur, Industri, Consumer, dan Reksa Dana.
   * **Fase 2: Bidding (Lelang)**: Tawar koin secara rahasia untuk menentukan urutan giliran jalan (urutan pertama mendapat keuntungan strategis).
   * **Fase 3: Aksi (Hybrid Card)**: Ambil kartu aksi dari meja. Setiap kartu memiliki opsi **Beli Saham** sesuai harga pasar, atau **Gunakan Skill** secara gratis (interaktif):
     * *Info Bursa*: Intip tren harga sektor di masa depan dan dapatkan tambahan koin dari Bank.
     * *Rumor*: Naikkan atau turunkan harga saham sektor terpilih secara manual.
     * *Quick Buy*: Menarik 2 kartu gratis dari meja bursa (Pemain dapat memilih sendiri kartu secara interaktif).
     * *Trading Fee*: Jual cepat saham pilihan dengan diskon potongan biaya transaksi.
     * *Akuisisi*: Ambil paksa saham lawan jika kepemilikan Anda setara/lebih besar dari lawan (korban mendapat ganti rugi dari Bank).
   * **Fase 4: Penjualan Saham**: Jual portofolio saham pilihan Anda ke pasar untuk menambah likuiditas kas.
   * **Fase 5: Ekonomi Sektor**: Pembukaan kartu berita ekonomi makro yang menggeser harga pasar secara otomatis. Fase ini juga dapat memicu krisis keuangan:
     * **Stock Split**: Harga terbagi dua dan jumlah lembar saham pemain dilipatgandakan.
     * **Stock Crash**: Nilai saham jatuh menyentuh batas bawah, menghanguskan seluruh kepemilikan saham pemain pada sektor tersebut.
3. **Riwayat Match & Statistik Dinamis**
   * Menyimpan riwayat statistik akhir permainan (tanggal bermain, koin, denda utang, net worth akhir, dan peringkat) secara riil menggunakan *Local Storage*.
4. **AI Bot dengan Kepribadian Unik**
   * **Wira**: Karakter AI bot agresif yang cenderung menawar bid tinggi dan gemar menimbun saham industri.
   * **Citra**: Karakter AI bot seimbang yang mengutamakan portofolio reksa dana aman dan melakukan aksi jual rasional.

---

## 🛠️ Arsitektur & Teknologi

* **Frontend Framework**: React (Vite)
* **State Management**: Zustand (Reaktif & Tersinkronisasi ke Local Storage)
* **Styling**: Tailwind CSS & Vanilla CSS Custom Tokens
* **Typography**: Outfit, Inter, & JetBrains Mono (Google Fonts)
* **Icons**: Google Material Symbols & Inline Custom SVG

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di perangkat Anda.

### 1. Kloning Repositori
```bash
git clone https://github.com/dayywkd/InvestLab.git
cd InvestLab
```

### 2. Instal Dependensi
Jalankan perintah berikut di terminal untuk memasang seluruh pustaka yang dibutuhkan:
```bash
npm install
```

### 3. Jalankan Mode Pengembangan (Dev Server)
Jalankan server lokal untuk mulai bermain di browser:
```bash
npm run dev
```
Buka tautan lokal yang tertera di terminal Anda (biasanya `http://localhost:5173`).

### 4. Build untuk Produksi
Gunakan perintah ini untuk mengompilasi berkas produksi yang dioptimalkan:
```bash
npm run build
```

---

## 📂 Struktur Berkas Penting

```text
├── public/                 # Favicon dan aset statis publik
├── src/
│   ├── components/
│   │   ├── SplashScreen.jsx      # Tampilan animasi awal game
│   │   ├── MainMenu.jsx          # Menu utama (Bento grid, Tutorial, Riwayat)
│   │   ├── GameLobby.jsx         # Ruang tunggu & detail match pemain
│   │   ├── GameScreen.jsx        # Dashboard utama (Trading floor, Bidding, Aksi)
│   │   └── GameOverScreen.jsx    # Ringkasan hasil akhir & peringkat Net Worth
│   ├── store/
│   │   └── useGameStore.js       # Otak logika game (State manager Zustand)
│   ├── index.css                 # Custom design tokens & candlestick keyframes
│   ├── main.jsx                  # Entry point React
│   └── App.jsx                   # Router / pengendali fase global game
├── index.html                    # Kerangka HTML utama
└── tailwind.config.js            # Konfigurasi Tailwind CSS
```

---

## ⚖️ Aturan Perhitungan Net Worth Akhir
Di akhir Ronde 6, seluruh aset Anda akan dilikuidasi otomatis berdasarkan harga penutupan pasar bursa terakhir:
$$\text{Net Worth} = \text{Total Kas} + (\text{Saham Sektor} \times \text{Harga Penutupan}) + (\text{Reksa Dana} \times \text{Harga Penutupan}) - (\text{Kartu Utang} \times 15)$$

Setiap kartu utang (🔴) yang tersisa akan mengurangi skor akhir Anda sebesar **15 Koin**.

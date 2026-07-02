# UI Design Specification — StockLab

Dokumen pendamping `prd.md`. Berisi arahan desain visual & layout untuk setiap halaman/layar StockLab, dengan pendekatan **mobile-first** dan skala ke desktop.

---

## 0. Design Tokens

### 0.1 Palet Warna

Arah visual mengikuti nuansa referensi Gaffer XI (kartu editorial, kontras tinggi, aksen oranye di atas dasar hangat) tapi dipetakan ke identitas finansial StockLab — lebih "market terminal" daripada "trading card kasual".

| Token | Hex | Penggunaan |
|---|---|---|
| `--bg-base` | `#12130F` | Background utama (dark mode default) — kesan "bursa malam hari" |
| `--bg-surface` | `#1C1E17` | Panel, card container, navbar |
| `--bg-surface-raised` | `#262920` | Modal, dropdown, elemen mengambang |
| `--ink-primary` | `#F4EFE2` | Teks utama di atas dasar gelap |
| `--ink-muted` | `#9C9884` | Teks sekunder, caption, label |
| `--accent-primary` | `#E8622C` | Aksen utama — CTA, highlight bid, badge harga |
| `--accent-gold` | `#D4A24C` | Efek "Stock Split" / kartu premium, Debt Counter icon aksen |
| `--profit-green` | `#4A9B6E` | Kenaikan harga, keuntungan, konfirmasi |
| `--loss-red` | `#C1453A` | Penurunan harga, Stock Crash, Debt Counter |
| `--sector-properti` | `#C97A3D` | Sektor Properti |
| `--sector-infrastruktur` | `#3D7CA6` | Sektor Infrastruktur |
| `--sector-industri` | `#6E7378` | Sektor Industri |
| `--sector-consumer` | `#5FA35A` | Sektor Consumer |
| `--sector-reksadana` | `#8A6BAE` | Reksa Dana |

> Dasar gelap dipilih agar deretan angka (harga, koin, grafik) punya kontras tinggi dan terasa seperti terminal trading — bukan cream/beige generik yang sering jadi default. Mode terang bisa jadi pengembangan v2, tidak wajib di MVP.

### 0.2 Tipografi

| Peran | Font | Penggunaan |
|---|---|---|
| Display / Angka Besar | **Outfit** (Bold–Black, sedikit condensed) | Harga saham, saldo koin, judul layar, badge rating kartu |
| Body / UI Teks | **Inter** (Regular–SemiBold) | Deskripsi, label tombol, log aktivitas |
| Monospace (opsional) | **JetBrains Mono** | Angka di panel log bursa & riwayat transaksi, memberi kesan data feed |

Skala tipe (mobile → desktop, `rem`):

| Level | Mobile | Desktop |
|---|---|---|
| Display XL (Net Worth akhir) | 2.5 | 4 |
| Display L (harga saham di kartu) | 1.75 | 2.25 |
| Heading | 1.25 | 1.5 |
| Body | 0.9375 | 1 |
| Caption/Label | 0.75 | 0.8125 |

### 0.3 Breakpoint & Grid

| Breakpoint | Lebar | Perilaku |
|---|---|---|
| `mobile` | < 640px | 1 kolom, navigasi bottom-bar, kartu di-scroll horizontal |
| `tablet` | 640–1024px | 2 kolom untuk dashboard (kartu + panel status bertumpuk) |
| `desktop` | > 1024px | 3 kolom: sidebar status kiri, Action Board tengah, log bursa kanan |

Spacing base: skala 4px (`4, 8, 12, 16, 24, 32, 48`). Radius: `12px` untuk kartu, `20px` untuk modal, `999px` untuk badge/pill.

### 0.4 Komponen Dasar

- **Kartu Aksi**: rasio 3:4, radius 12px, shadow lembut (`0 4px 16px rgba(0,0,0,0.35)`), border 1px warna sektor pada 30% opacity.
- **Tombol Primer**: solid `--accent-primary`, teks `--bg-base`, radius pill, state hover = brightness +8%, state disabled = opacity 40%.
- **Tombol Sekunder**: outline 1px `--ink-muted`, transparan, teks `--ink-primary`.
- **Badge Angka** (harga/koin): pill kecil dengan ikon, warna kontekstual (hijau naik, merah turun, abu netral).
- **Bottom Sheet** (mobile): dipakai untuk detail kartu, konfirmasi aksi, dan riwayat — menggantikan modal tengah-layar penuh agar ibu jari mudah menjangkau tombol.

---

## 1. Splash Screen

**Tujuan**: transisi singkat (1.5–2 detik) sebelum masuk Main Menu, membangun identitas "terminal bursa" sejak detik pertama.

```
┌─────────────────────┐
│                      │
│                      │
│      [ Logo ]        │
│     STOCKLAB         │
│   ─ loader bar ─     │
│   "Menyiapkan pasar…" │
│                      │
└─────────────────────┘
```

- **Mobile**: logo terpusat vertikal & horizontal, animasi loader berupa garis tipis yang mengisi seperti candlestick chart naik-turun singkat (bukan spinner generik).
- **Desktop**: identik, hanya logo & tipografi diperbesar mengikuti skala Display XL.
- Transisi keluar: fade + slight scale-up (0.98 → 1) menuju Main Menu, durasi 300ms.

---

## 2. Main Menu (Bento Grid)

**Tujuan**: satu layar tanpa scroll, langsung menuju Play atau Tutorial, kesan modular seperti dashboard bursa.

```
Desktop (grid bento):
┌───────────────┬───────────┐
│               │  Tutorial │
│   PLAY        ├───────────┤
│  (besar)      │  Riwayat  │
│               │  Terakhir │
├───────┬───────┴───────────┤
│ Skor  │   Pengaturan/     │
│Terbaik│   Tentang Game    │
└───────┴───────────────────┘

Mobile (tumpuk 1 kolom):
┌─────────────┐
│    PLAY     │  ← tile besar, full width
├─────────────┤
│  Tutorial   │
├─────────────┤
│  Riwayat    │
├─────────────┤
│ Skor Terbaik│
└─────────────┘
```

- Tile "PLAY" selalu paling dominan (ukuran 2x tile lain), warna `--accent-primary`, dengan ikon panah/play.
- Di mobile, grid bento berubah jadi tumpukan vertikal tile full-width dengan tinggi berbeda (tile Play lebih tinggi) — tetap terasa "bento" lewat variasi tinggi, bukan grid kaku seragam.
- Tiap tile punya micro-interaction: sedikit scale-down (0.97) saat ditekan, memberi umpan balik sentuh yang jelas di mobile.
- Header ringan di atas: nama game + ikon pengaturan kecil di pojok kanan atas (bukan navbar penuh, karena menu ini single-purpose).

---

## 3. Lobby Virtual (Placeholder Pra-Game)

**Tujuan**: konfirmasi terakhir sebelum masuk game, menampilkan 3 peserta (Player + Wira + Citra) sebagai placeholder statis.

```
┌─────────────────────┐
│  Melawan:            │
│  ┌────┐ ┌────┐ ┌────┐│
│  │You │ │Wira│ │Citra││
│  └────┘ └────┘ └────┘│
│                      │
│  Saldo Awal: 30 Koin │
│  Ronde: 6            │
│                      │
│   [ Mulai Permainan ]│
└─────────────────────┘
```

- **Mobile**: 3 avatar player dalam satu baris horizontal (scroll tidak diperlukan karena hanya 3), info saldo & ronde di bawahnya sebagai ringkasan ringkas, tombol CTA full-width menempel di bawah (thumb-friendly).
- **Desktop**: layout sama namun dengan whitespace lebih lega dan avatar lebih besar; tombol CTA di tengah, tidak perlu full-width.
- Avatar Bot AI (Wira, Citra) menggunakan warna beda dari avatar Player agar mudah dibedakan sejak lobby.

---

## 4. Trading Dashboard (Layar Utama Gameplay)

Layar paling kompleks — perlu strategi adaptasi mobile yang jelas karena banyak informasi simultan: status ronde, Action Board, portofolio, log bursa, dan Debt Counter.

### 4.1 Layout Desktop (3 kolom)

```
┌──────────┬─────────────────────┬──────────┐
│ Sidebar  │   Action Board       │  Log     │
│ Status   │  (kartu fan/overlap) │  Bursa   │
│          │                      │ (scroll) │
│ - Ronde  ├─────────────────────┤          │
│ - Saldo  │  Portofolio Pemain  │          │
│ - Debt   │  (mini-card /sektor)│          │
│ Counter  │                      │          │
└──────────┴─────────────────────┴──────────┘
```

### 4.2 Layout Mobile (tab-based, 1 kolom aktif)

Karena 3 kolom tidak muat di layar sempit, gunakan **bottom tab navigation** dengan 3 tab: `Meja` (Action Board), `Portofolio`, `Log Bursa`. Status inti (Ronde, Saldo, Debt Counter) selalu terlihat di **sticky header**, tidak ikut berpindah tab.

```
┌─────────────────────┐
│ Ronde 3/6  🪙124  🔴2│ ← sticky header
├─────────────────────┤
│                      │
│   (konten tab aktif) │
│   → kartu di-scroll   │
│     horizontal snap   │
│                      │
├─────────────────────┤
│  Meja | Folio | Log  │ ← bottom tab bar
└─────────────────────┘
```

- **Sticky header** menampilkan 3 angka paling kritis sepanjang waktu: Ronde saat ini, saldo koin, dan Debt Counter (dengan warna merah kontras bila > 0) — sesuai requirement PRD bagian 8.
- **Tab "Meja"**: Action Board dengan 6 kartu ditampilkan sebagai carousel horizontal *snap-scroll* (bukan grid 2x3 yang memaksa scroll vertikal berlebih) — satu kartu fokus di tengah, kartu tetangga terlihat sebagian di kiri/kanan untuk memberi konteks urutan.
- **Tab "Portofolio"**: daftar mini-card per sektor yang dimiliki, disusun vertikal, masing-masing menampilkan harga terkini + jumlah lembar + tombol jual cepat.
- **Tab "Log Bursa"**: feed vertikal scroll dengan font monospace kecil, event terbaru di atas, ikon berbeda per jenis event (harga naik/turun, split, crash).
- Badge notifikasi (dot merah kecil) muncul di tab bar bila ada event baru di tab yang sedang tidak aktif (misalnya Stock Crash terjadi saat pemain ada di tab Meja).

### 4.3 Interaksi Kartu Aksi & Fase Jual

- Saat kartu ditekan (mobile) / diklik (desktop), muncul **bottom sheet** (mobile) atau **modal tengah** (desktop) berisi detail kartu, dengan dua tombol besar berdampingan: `Simpan Saham` dan `Gunakan Skill`, sesuai lebar layar (stack vertikal di mobile bila teks tombol panjang).
- Fase Jual menggunakan pola yang sama seperti Portofolio tab: tiap sektor punya tombol `Jual 1` / `Jual Semua` / `Lewati`, dengan indikator urutan giliran jual (avatar kecil bergeser menandai giliran siapa).
- Sparkline harga (tren mini) ditampilkan sebagai grafik garis tipis di dalam kartu itu sendiri (bukan grafik terpisah) — cukup 4–5 titik data terakhir, cukup untuk memberi rasa arah tanpa memakan ruang.

---

## 5. Dialog Modal & Peringatan

### 5.1 Pop-up Krisis Pasar (Split/Crash)

- **Mobile & Desktop**: modal fullscreen sesaat (overlay gelap 80% + konten terpusat), tidak bisa di-dismiss dengan tap-outside — harus ditekan tombol "Mengerti" agar pemain benar-benar membaca dampaknya.
- Stock Split: warna dominan `--accent-gold` + animasi ikon "pecah/lipat ganda" singkat.
- Stock Crash: warna dominan `--loss-red` + animasi ikon "jatuh" singkat, disertai getar layar halus (screen shake ringan, opsional & bisa dimatikan untuk aksesibilitas).

### 5.2 Konfirmasi Keluar Match

- Modal kecil terpusat, 2 tombol: `Batal` (sekunder) dan `Keluar` (destructive — warna `--loss-red` outline).

### 5.3 Detail Kartu Aksi

- Sudah dicakup di 4.3 (bottom sheet mobile / modal desktop).

---

## 6. Layar GameOver / Hasil Akhir

**Tujuan**: menyajikan peringkat akhir dengan jelas, termasuk breakdown Net Worth (aset terlikuidasi − denda utang).

```
┌─────────────────────┐
│   🏆 Peringkat Akhir  │
│                      │
│ 1. Citra   🪙 210    │
│ 2. You     🪙 178    │
│ 3. Wira    🪙 140    │
│                      │
│  Breakdown Kamu:     │
│  Aset likuidasi: 210 │
│  Denda utang: -32    │
│  ─────────────────   │
│  Net Worth: 178      │
│                      │
│ [Main Lagi] [Menu]   │
└─────────────────────┘
```

- **Mobile**: peringkat sebagai daftar vertikal dengan baris pemenang (posisi 1) diberi highlight `--accent-gold` dan sedikit lebih besar dari baris lain. Breakdown Net Worth pemain ditampilkan sebagai card terpisah di bawah daftar peringkat, bukan tabel — lebih mudah dibaca di layar sempit.
- **Desktop**: peringkat 1-2-3 bisa divisualisasikan sebagai podium horizontal di bagian atas, breakdown di bawahnya dalam layout 2 kolom (ringkasan aset vs ringkasan utang).
- Dua CTA di footer: `Main Lagi` (primer, mengulang match baru) dan `Kembali ke Menu` (sekunder).

---

## 7. Prinsip Aksesibilitas & Responsivitas Umum

- Semua tombol interaktif minimum **44×44px** area sentuh di mobile.
- Kontras teks terhadap background minimum rasio **4.5:1** (terutama teks di atas warna sektor — perlu overlay gelap tipis bila warna sektor terlalu terang).
- Animasi (screen shake, transisi kartu) menghormati preferensi `prefers-reduced-motion` — sediakan versi tanpa gerakan berlebih.
- Semua status kritis (Debt Counter, hasil Split/Crash) tidak hanya mengandalkan warna — sertakan ikon/label teks agar tetap jelas bagi pengguna buta warna.
- Orientasi: game dioptimalkan untuk **portrait** di mobile (sesuai pola thumb-reach bottom tab); landscape mobile cukup didukung minimal (scale layout desktop dengan sidebar disederhanakan jadi drawer).

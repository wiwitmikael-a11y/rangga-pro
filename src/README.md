# 🏙️ Ragetopia: Advanced 3D Web Portfolio

Ragetopia adalah platform portofolio interaktif berbasis WebGL yang menggabungkan estetika *cyberpunk* dengan teknologi mutakhir. Proyek ini dirancang untuk menunjukkan keahlian dalam **Full-Stack Development**, **3D Graphics (Three.js)**, dan **AI Integration**.

---

## 🛠️ Tech Stack Utama
- **Framework:** React 18 (TypeScript)
- **3D Engine:** React Three Fiber (R3F) & Three.js
- **Helpers:** @react-three/drei
- **Post-Processing:** @react-three/postprocessing (Bloom, Noise)
- **AI/Chat:** Local Keyword Engine (siap diintegrasikan ke berbagai LLM Endpoint)
- **Styling:** Custom CSS + Glassmorphism
- **Build Tool:** Vite

---

## 📂 Arsitektur Folder & File

### `/src`
- `App.tsx`: *Root component* yang mengelola state transisi global (`video` -> `loading` -> `start` -> `experience`).
- `constants.ts`: Sumber kebenaran tunggal untuk data portofolio, posisi distrik, dan konfigurasi scene.
- `chat-data.ts`: Database percakapan bilingual untuk asisten digital di Nexus Core.

### `/src/components/scene` (Logika 3D)
- `Experience3D.tsx`: Kontainer utama scene 3D. Mengelola pencahayaan, event pointer, dan koordinasi antar sistem 3D.
- `CameraRig.tsx`: Pengontrol kamera sinematik. Menggunakan interpolasi `lerp` dan `slerp` untuk transisi halus antar distrik atau saat mengikuti kapal.
- `FlyingShips.tsx`: Sistem simulasi kendaraan. Memiliki 2 mode: **Autonomous AI** (terbang, berputar, dan mendarat otomatis) serta **Manual Pilot** (kontrol penuh oleh user).
- `DistrictRenderer.tsx`: Merender node interaktif (Major) dan bangunan prosedural (Minor). Menggunakan `DataBridge` untuk memvisualisasikan aliran data ke pusat kota.
- `ProceduralTerrain.tsx`: Menggunakan *Simplex Noise* untuk membuat topografi dunia yang luas dengan pusat kota yang rata (flat).

### `/src/components/ui` (Antarmuka Pengguna)
- `HUD.tsx`: *Head-Up Display* yang menyediakan kontrol navigasi, penggantian POV, dan aktivasi mode pilot.
- `ProjectSelectionPanel.tsx`: Modal multifungsi yang merender konten dinamis (Radar Chart Skills, Form Kontak, atau Chat AI) tergantung distrik yang dipilih.
- `SkillsRadarChart.tsx`: Visualisasi data SVG interaktif untuk menampilkan metrik keahlian secara radial.
- `StartScreen.tsx`: Mengelola urutan *booting* dan animasi pintu gerbang (Gate) saat masuk ke world.

---

## ⚙️ Mekanik Utama

### 1. Sistem Kamera (CameraRig)
Kamera tidak dikontrol langsung secara bebas saat transisi. 
- **Transition Mode:** Saat user memilih distrik, `CameraRig` mengambil koordinat `cameraFocus` dari `constants.ts` dan melakukan interpolasi posisi.
- **Ship POV:** Kamera dipasang sebagai *child* virtual dari kapal yang dipilih dengan *offset* tertentu sesuai tipe kapal (`fighter`, `transport`, atau `copter`).
- **Orbit Mode:** Saat diam, `OrbitControls` diaktifkan kembali untuk memungkinkan rotasi manual oleh user.

### 2. Simulasi Kendaraan (FlyingShips)
- **Autonomous AI:** Kapal memiliki mesin state (`FLYING`, `DESCENDING`, `LANDED`, `ASCENDING`). Target terbang ditentukan secara acak menggunakan radius lingkaran, dan titik pendaratan dipilih dari array `ALL_LANDING_SPOTS`.
- **Manual Pilot:** Saat diaktifkan, input keyboard (WASD/Space/Shift) atau Virtual Joystick (Mobile) akan memanipulasi vektor akselerasi dan kuaternion kapal secara langsung. Sistem ini memiliki deteksi batas peta (Soft Boundary) agar kapal tidak keluar dari dunia.
- **Weapon System:** `LaserManager` menangani pembuatan instansi laser secara instansiasi (`instanced-based logic`) dengan cooldown untuk performa.

### 3. Interaksi Distrik (Hold-to-Select)
Untuk mencegah klik yang tidak disengaja saat melakukan rotasi kamera, digunakan mekanik **Hold-to-Select**:
- User harus menekan dan menahan pointer pada model 3D atau label selama 1000ms.
- `HolographicDistrictLabel` akan menampilkan bar kemajuan (gauge) visual.
- Logic ini diimplementasikan menggunakan `requestAnimationFrame` untuk presisi waktu lintas frame.

### 4. Sistem Audio (AudioContext)
Menggunakan Web Audio API untuk manajemen suara yang efisien:
- **Preloading:** Semua aset audio dimuat di awal ke dalam `AudioBuffer`.
- **Looping Management:** Suara mesin (`engine_hum`) dan ambience diatur agar bisa *fade-in/fade-out* saat aktif atau berhenti.
- **User Interaction Unlock:** Konteks audio hanya diaktifkan setelah interaksi pertama pengguna untuk mematuhi kebijakan browser modern.

---

## 🛠️ Panduan Pengembangan

### Menambah Distrik Baru
Update array `portfolioData` di `src/constants.ts`:
1. Tentukan `id` unik.
2. Tentukan koordinat `position`.
3. Tambahkan `cameraFocus` (posisi kamera dan target lookAt).
4. Jika ingin menggunakan model kustom, tambahkan properti `modelUrl`.

### Modifikasi Konten AI
Edit `src/chat-data.ts`. Anda bisa menambah topik baru dengan kata kunci (`keywords`) dan respons bot. Sistem akan secara otomatis melakukan pencocokan kata kunci dari input bebas pengguna.

### Build & Deploy
```bash
npm install
npm run build
```
Hasil build ada di folder `/dist`. Pastikan `base` di `vite.config.ts` sesuai dengan jalur hosting Anda.

---

## 📜 Lisensi & Kredit
Seluruh model 3D di-hosting di repositori eksternal milik `@wiwitmikael-a11y` (github) untuk optimasi ukuran paket. Pastikan koneksi internet stabil saat menjalankan aplikasi untuk memuat aset GLB.

**Developed with ❤️ by Rangga Prayoga Hermawan**
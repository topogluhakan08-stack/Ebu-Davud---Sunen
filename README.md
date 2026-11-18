# Sünen-i Ebî Dâvûd · Kitâbü'l-Edeb Öğrenme Atlası

**Kurulum ve Deploy Adımları (Hızlı Başlangıç)**

Bu proje tamamen statik (client-side) bir **Vite + React + TypeScript + Tailwind CSS** uygulamasıdır. Çalışma anında harici bir API veya sunucuya ihtiyaç duymaz; tüm veriler `/src/data/` altındaki JSON dosyalarında gömülü olarak sunulur.

## 1. Kurulum ve Yerel Çalıştırma

Gereksinimler: **Node.js 20+** ve **npm 10+**

```bash
# 1. Depoyu klonlayın veya proje dizinine girin
git clone <repo-url>
cd sunen-kitabul-edeb

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirme sunucusunu başlatın (http://localhost:3000)
npm run dev

# 4. Üretim derlemesini (production build) alın
npm run build
# veya doğrudan Vite ile:
npx vite build
```

Derleme çıktısı `/dist` klasörüne üretilir. Yerel derlemeyi önizlemek için:

```bash
npm run preview
```

---

## 2. Vercel ile Deploy Adımları (Tek Tıkla Yayınlama)

Proje kök dizinindeki `vercel.json` dosyası **SPA yönlendirmeleri** ve **statik varlık önbellekleme** kurallarıyla önceden yapılandırılmıştır.

1. Projeyi GitHub, GitLab veya Bitbucket deposuna yükleyin (`git push`).
2. [Vercel](https://vercel.com) paneline giriş yapın ve **Add New → Project** seçin.
3. İlgili depoyu içe aktarın (**Import**).
4. **Configure Project** ekranında aşağıdaki ayarları doğrulayın:
   - **Framework Preset:** `Vite`
   - **Build Command:** `vite build` (veya `npm run build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Ortam değişkeni (Environment Variable) gerekmez; doğrudan **Deploy** butonuna tıklayın.
6. Vercel `vercel.json` dosyasındaki `rewrites` kuralı sayesinde React Router alt rotalarını (`/hadisler`, `/ebu-davud`, `/sunen` vb.) sorunsuz şekilde `/index.html`'e yönlendirir.

---

## 3. Projenin Amacı ve Kaynak Kapsamı

Bu öğrenme atlası, İstanbul Üniversitesi İlahiyat Fakültesi *Hadis III* ders notlarındaki birincil kaynakları görsel hafıza, etkileşimli kelime analizi, coğrafi/tarihî haritalama ve sesli okuma (TTS) ile kalıcı şekilde öğretmeyi amaçlar:

1. **TDV İslâm Ansiklopedisi — "EBÛ DÂVÛD es-SİCİSTÂNÎ" Maddesi:** Doğum/vefat bilgileri, nisbeleri, seyahat haritası (14 ilim merkezi), zaman çizelgesi, hoca-talebe ağı, hadisçiliği, fıkhî kimliği, güzel sözleri, dört hadis vurgusu, 9 ana eseri, hakkında yapılan çalışmalar ve tam bibliyografya.
2. **TDV İslâm Ansiklopedisi — "es-SÜNEN" Maddesi:** 500.000 hadisten 4.800 seçilmiş rivayete süzülme hunisi, mürsel oranı, neşir sayım karşılaştırmaları (Wensinck, Abdülhamîd, Avvâme, Liechtenstein), telif metodu, nüsha râvileri, baskı şehirleri haritası, etkileşimli şerh kitaplığı, ihtisar/tashih çalışmaları ve bibliyografya.
3. **Sünen-i Ebî Dâvûd — Kitâbü'l-Edeb (36. Kitap, s. 264–279, Hadis 4740–4777):**
   - **11 Bab · 38 Hadis · Tüm İsnadlar ve Haşiyeler/Dipnotlar:**
     - **Bab 1:** Hilim ve Hz. Peygamber'in ﷺ Ahlâkı (4740–4742)
     - **Bab 2:** Vakar (4743)
     - **Bab 3:** Öfkeyi Yutan (4744–4746)
     - **Bab 4:** Öfke Anında Söylenecek Söz (4747–4751)
     - **Bab 5:** Emirde Aşırıya Kaçmama / Kolaylık (4752–4754)
     - **Bab 6:** Güzel Muaşeret (4755–4761)
     - **Bab 7:** Hayâ (4762–4764)
     - **Bab 8:** Güzel Ahlâk (4765–4768)
     - **Bab 9:** Yüksek Makam Hırsından Kaçınma (4769–4770)
     - **Bab 10:** Aşırı Övgünün Kerâheti (4771–4773)
     - **Bab 11:** Rıfk / Yumuşaklık (4774–4777)

---

## 4. Kullanılan Teknolojiler

| Katman | Teknoloji | Kullanım Amacı |
| --- | --- | --- |
| Çekirdek | **Vite 8 + React 19 + TypeScript** | Hızlı statik derleme ve tip güvenliği |
| Stil & Tema | **Tailwind CSS v4** | Parşömen/Krem ve yumuşak Koyu Tema, 11 Bab renk sistemi |
| Gezinme | **React Router v7** | İstemci taraflı SPA rota yönetimi |
| Animasyon | **Motion (Framer Motion)** | `prefers-reduced-motion` uyumlu akıcı geçişler |
| Harita & Grafik | **Leaflet + Recharts + D3** | Radyal Zihin Haritası, İsnad Tabaka Ağacı, seyahat/neşir haritaları ve istatistik grafikleri |
| Seslendirme | **Ön-üretilmiş MP3 + Web Speech API** | Dosya öncelikli erkek ses oynatıcı (`-5s/+5s`, hız, cümle vurgusu) ve cihaz sesi yedeği |
| PWA & Çevrimdışı | **vite-plugin-pwa** | Service worker, temel uygulama önbelleği ve isteğe bağlı çevrimdışı ses paketi indirme |
| İkon & İllüstrasyon | **Lucide React + Özel SVG** | 11 Bab ve kavramlar için özgün, figürsüz sembolik çizimler |

---

## 5. Hazır Erkek Ses Dosyalarının Üretilmesi (Opsiyonel)

Uygulama çalışma anında harici API anahtarı gerektirmez; hazır ses dosyası yoksa otomatik olarak tarayıcının Web Speech API erkek ses yedeğine geçer. İsterseniz tek seferlik derleme öncesi adım olarak `GEMINI_API_KEY` ve `ffmpeg` ile 38 hadis + 8 ana bölüm için mono MP3 dosyalarını üretebilirsiniz:

```bash
GEMINI_API_KEY="your-key" npm run generate:audio
```

Bu komut `public/audio/*.mp3` dosyalarını üretir ve `/src/data/audio-manifest.json` dosyasını günceller. İlk açılışta kotayı korumak için MP3 dosyaları PWA precache kapsamı dışında tutulur; kullanıcı Ayarlar sayfasından **"Sesleri Çevrimdışı İndir"** butonuyla isteğe bağlı olarak önbelleğe alabilir.

---

## 6. Proje Yapısı

```text
├── public/
│   ├── assets/aistudio/         # Kaynak PDF belgesi
│   ├── audio/                   # Opsiyonel ön-üretilmiş MP3 anlatım dosyaları
│   ├── icon.svg                 # Ana vektörel uygulama ikonu
│   ├── pwa-192x192.png          # PWA standart ikon (192px)
│   ├── pwa-512x512.png          # PWA standart ikon (512px)
│   ├── pwa-maskable-512x512.png # Android uyumlu maskable ikon
│   └── apple-touch-icon.png     # iOS Safari ana ekran ikonu (180px)
├── scripts/
│   └── generate-audio.mjs       # Tek seferlik erkek ses (MP3 + manifest) üreticisi
├── src/
│   ├── components/
│   │   ├── hadiths/             # Hadis kartları, 100% kelime analizi ve D3 İsnad Ağacı
│   │   ├── icons/               # 11 Bab için sembolik SVG illüstrasyonlar
│   │   ├── layout/              # Masaüstü üst bar, mobil alt gezinme, bilgi altlığı
│   │   ├── mindmap/             # D3 Etkileşimli 11 Bab Radyal Zihin Haritası
│   │   ├── pwa/                 # Yükleme istemi ve çevrimdışı durum göstergesi
│   │   ├── tts/                 # Dosya-öncelikli ses kontrol çubuğu (-5s/+5s/seek/hız)
│   │   └── ui/                  # Düğmeler, kartlar, sekmeler ve durum rozetleri
│   ├── context/                 # Dil (TR/FR/AR), tema, erişilebilirlik ve ilerleme durumu
│   ├── data/                    # Statik JSON/TS verileri (38 hadis, 736+ kelime sözlüğü, 421 soru, audio manifest)
│   ├── hooks/                   # useSpeech, usePWAInstall, useOnlineStatus
│   ├── pages/                   # Ana Sayfa, Ebû Dâvûd, es-Sünen, Hadisler, Öğren, Sözlük, Harita, Ara, Ayarlar
│   ├── types/                   # Ortak TypeScript arayüzleri
│   └── utils/                   # Arapça kök/hareke segmentasyonu, isnad ağacı, ses servisi, i18n ve birim testler
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

---

## 7. Doğruluk, Erişilebilirlik ve Etik İlkeleri

- **PDF Sadakati:** Ansiklopedi maddeleri ve hadis metinleri PDF kaynağına sadık kalır; ek açıklamalar açıkça `"Ek açıklama"` etiketiyle ayrılır. Belirsiz veya okunamayan kısımlar tahmin edilmez, `needs_review` rozetiyle işaretlenir.
- **Saygılı Görsel Dil:** Hz. Peygamber ﷺ ve sahâbîler figüratif olarak çizilmez; yalnızca hat kaligrafisi, ışık ve sembolik geometrik/doğal motiflerle temsil edilir.
- **Eğitim Uyarısı:** Türkçe ve Fransızca çeviriler ile kelime anlamları eğitim amaçlıdır; fetva veya nihai meal yerine geçmez.
- **Erişilebilirlik (WCAG AA):** Klavye gezinmesi, odak halkaları (`focus-visible`), `44px+` dokunma alanları, yüksek kontrast modu, yazı boyutu ölçekleme ve azaltılmış hareket (`reduced motion`) desteği yerleşiktir.

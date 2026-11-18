# Tasarım Sistemi Dokümantasyonu (Design System)

Bu doküman, **Sünen-i Ebî Dâvûd · Kitâbü'l-Edeb Öğrenme Atlası** uygulamasının görsel hafıza sistemini, renk paletini, tipografi hiyerarşisini, temel UI bileşenlerini, mobil öncelikli duyarlı yerleşim kurallarını ve PWA standartlarını tanımlar.

---

## 1. Ana Renk Paleti (60-30-10 Bütçesi)

Arayüz, klasik İslâmî yazma eser estetiğini modern dijital okuma ergonomisiyle birleştirir.

### Açık Tema (Sıcak Krem / Parşömen)
| Rol | Token | Hex | Kullanım |
| --- | --- | --- | --- |
| Ana Zemin (%60) | `--bg-canvas` | `#F7F3EA` | Sayfa arka planı (sıcak parşömen) |
| Yükseltilmiş Kart | `--bg-card` | `#FBF9F4` | Hadis kartları, okuma panelleri |
| İkincil Yüzey (%30) | `--bg-surface` | `#EFE9DB` | Sekme şeritleri, alt alanlar, ayırıcı zemin |
| İnce Kenarlık | `--border-hairline` | `#DFD6C3` | `1px` saç teli çerçeveler ve ayırıcılar |
| Ana Metin | `--text-primary` | `#1C1917` | Yüksek kontrastlı mürekkep siyahı (WCAG AA+) |
| İkincil Metin | `--text-secondary` | `#57534E` | Üst bilgi, dipnot ve ikincil açıklamalar |
| Birincil Vurgu (%10) | `--accent-navy` | `#14284B` | Derin lacivert: ana eylem düğmeleri, başlıklar |
| İkincil Vurgu | `--accent-emerald` | `#0F5132` | Derin zümrüt: başarı, ezberlendi, ses çalma |
| Altın Detay | `--accent-gold` | `#B8862D` | Tezhip çizgileri, vurgu numaraları, iktibaslar |

### Koyu Tema (Yumuşak Kontrast · Gece Mürekkebi)
| Rol | Token | Hex | Kullanım |
| --- | --- | --- | --- |
| Ana Zemin | `--bg-canvas` | `#10151E` | Göz yormayan koyu mürekkep zemini |
| Yükseltilmiş Kart | `--bg-card` | `#171E2B` | Kart yüzeyleri (zeminle kontrollü kontrast) |
| İkincil Yüzey | `--bg-surface` | `#1F2838` | Sekme şeritleri ve ikincil alanlar |
| İnce Kenarlık | `--border-hairline` | `#2C374C` | Yumuşak koyu tema çizgileri |
| Ana Metin | `--text-primary` | `#EFEAE0` | Sıcak fildişi metin (`tracking: +0.01em` telafisi) |
| Birincil Vurgu | `--accent-navy` | `#3B67B0` | Erişilebilir parlak lacivert |
| İkincil Vurgu | `--accent-emerald` | `#2D9F6B` | Canlı ama yumuşak zümrüt |
| Altın Detay | `--accent-gold` | `#D9AD5B` | Parşömen altını |

---

## 2. 11 Bab Görsel Hafıza Renk Sistemi

Her bab, zihinde kalıcı renk-konu eşleşmesi kurmak için özgün, göze yormayan bir ana renge ve sembolik bir SVG motife sahiptir:

| Bab | Konu | Hadis Aralığı | Sayfa | Ana Renk | Sembolik Motif |
| --- | --- | --- | --- | --- | --- |
| **1** | Hilim ve Hz. Peygamber'in ﷺ Ahlâkı | 4740–4742 | 264–266 | `#1D4E89` (Safir Lacivert) | Denge ve zeytin dalı |
| **2** | Vakar | 4743 | 266 | `#4B3F72` (Mürdüm İndigo) | Sütun ve kandil |
| **3** | Öfkeyi Yutan | 4744–4746 | 266–267 | `#1F6E6C` (Çini Turkuazı) | Sakin su kabı |
| **4** | Öfke Anında Söylenecek Söz | 4747–4751 | 268–270 | `#A64B2A` (Yanık Kiremit) | Alev ve abdest damlası |
| **5** | Emirde Kolaylık (Teysir) | 4752–4754 | 270 | `#2B6E44` (Orman Zümrütü) | Açılan yol |
| **6** | Güzel Muaşeret | 4755–4761 | 270–273 | `#8A6024` (Kehribar) | Misafir kemeri |
| **7** | Hayâ | 4762–4764 | 273–275 | `#3E5C76` (Sis Mavisi) | İffet perdesi |
| **8** | Güzel Ahlâk | 4765–4768 | 275–276 | `#6E5A28` (Vav Altını) | Sekiz köşeli mizan yıldızı |
| **9** | Makam Hırsından Kaçınma (Tevazu) | 4769–4770 | 276–277 | `#6A4C3B` (Toprak Kahve) | Deve silüeti |
| **10** | Aşırı Övgünün Kerâheti | 4771–4773 | 277–278 | `#8C3B4A` (Lâl Bordo) | Kalem ve ölçü kalkanı |
| **11** | Rıfk / Yumuşaklık | 4774–4777 | 278–279 | `#3A7D5C` (Nane Zümrütü) | Yumuşak el ve filiz |

> **Etik Kural:** Hz. Peygamber ﷺ ve sahâbîler figüratif olarak çizilmez; yalnızca hat kaligrafisi, ışık ve soyut/doğal sembollerle temsil edilir.

---

## 3. Tipografi Kuralları

1. **Arapça Hadis ve İsnad Metni (`Amiri` + `Noto Naskh Arabic`):**
   - Yön: `dir="rtl"`
   - Boyut: `clamp(1.75rem, 2.4vw, 2.25rem)` (28px–36px arası; harekelerin net görünmesi için)
   - Satır aralığı: `line-height: 2.15` (üstün, esre, ötre, şedde çakışmasını önler)
   - İsnad rengi metne göre bir ton daha yumuşaktır; `"قال رسول الله ﷺ"` gibi ifadeler altın/lacivert tonla belirginleştirilir.
2. **Türkçe / Fransızca Editoryal Başlıklar (`Cormorant Garamond`):**
   - Klasik kitap estetiği, dengeli satır kırılımı (`text-wrap: balance`).
3. **Gövde ve Arayüz Metni (`Plus Jakarta Sans`):**
   - Okuma genişliği `65ch–75ch` ile sınırlandırılır; satır aralığı `1.65`.
4. **Sayısal Veriler (`IBM Plex Mono` · `tabular-nums`):**
   - Hadis numaraları (`4740–4777`), sayfa numaraları (`264–279`), hicrî/mîlâdî tarihler ve grafik eksenleri.

---

## 4. Temel UI Bileşenleri

- **Düğmeler (`Button`):**
  - En az `44px` dokunma yüksekliği (`min-h-[44px]`), tek satır (`whitespace-nowrap shrink-0`), görünür `focus-visible` halkası.
  - Varyantlar: `primary` (Derin Lacivert), `emerald` (Zümrüt), `gold` (Altın), `secondary` (Parşömen Yüzey), `outline` (Saç Teli Çerçeve), `ghost` (Metin/İkon).
- **Kartlar (`ManuscriptCard`):**
  - Tek düzey yükselti (`shadow-sm` veya `1px` kenarlık; ikisi aşırıya kaçmadan dengelenir).
  - Kart içinde kart yuvalamaktan kaçınılır; bölümler boşluk ve `EditorialDivider` saç teli çizgileriyle ayrılır.
  - Kalın sol şerit (`border-l-4`) kullanılmaz.
- **Sekmeler (`Tabs`):**
  - `segmented` (Parşömen kapsayıcı içinde aktif beyaz/koyu kart) ve `underline` (editöryal alt çizgi) varyantları, tam klavye (`ArrowLeft`/`ArrowRight`) ve `role="tab"` / `aria-selected` desteğiyle.
- **Üst Bilgi ve Meta Veriler:**
  - Statik etiketlerde kapsül (pill) yığını yerine nokta (`·`) ayırıcılı yalın tipografi kullanılır.
  - Rozetler yalnızca fonksiyonel durumlar için kullanılır (`needs_review` sarı rozeti, `Ek açıklama` rozeti, `Ezberlendi` durumu).

---

## 5. Mobil Öncelikli Responsive ve PWA İlkeleri

- **Başparmak Bölgesi (Thumb-Zone):** Mobil ekranlarda alt sabit gezinme çubuğu kolay erişim için alt kenarda yer alır; üst ve alt sabit şeritlerin toplam yüksekliği mobil ekran yüksekliğinin `%15`'ini aşmaz (`~112px`).
- **PWA Desteği:** `vite-plugin-pwa` ile tüm statik sayfalar, JSON veri dosyaları ve font/ikon varlıkları çevrimdışı kullanım için önbelleğe alınır. Başlıkta ve Ayarlar ekranında uygulama içi yükleme (`PWAInstallButton`) ve çevrimdışı durum göstergesi (`OfflineIndicator`) yer alır.

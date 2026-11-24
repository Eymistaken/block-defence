# Blok Savunması v2 — Geliştirici Notları

## Derleme
- Kaynak: `src/index.html`, `src/css/main.css`, `src/js/*.js` (dosya adı sırasıyla birleşir).
- `python3 build.py` → `block-defence.html` (müzikli, yaklaşık 67 MB; telifli müzik içerdiği için depoya girmez).
- `python3 build.py --site` → `dist/index.html` (müziksiz; Netlify bunu yayınlar, ayar `netlify.toml`'da).
- `python3 build.py --no-music` → `build/test.html` (müziksiz, hızlı test için).
- Müzikler `build/music-cache/` içinde Opus 48 kbps olarak önbelleklenir; silinirse ffmpeg ile yeniden üretilir.
- Orijinal v1 yedeği: `yedek/blok-savunmasi-v1.html`.

## JS dosyaları
| Dosya | İçerik |
|---|---|
| 00–05 | yardımcılar, kayıt (v1'den geçiş), ses efektleri, müzik çalar, dokular, piksel ikonlar |
| 10–13 | kuleler, yaratıklar ve bosslar, eşyalar ve kazılabilir bloklar, boyutlar ve biyomlar |
| 14–17 | 40 harita (Overworld, Nether, End, Sift) |
| 18 | zorluklar, Büyü Masası, başarımlar, yetenekler, bölge güçleri, kilitler |
| 20–22 | kule ve yaratık çizimleri, ikonlar |
| 30–36 | oyun durumu ve dalgalar, kule ve yaratık mantığı, mermiler, harita mekanikleri, yetenekler ve eşyalar, efektler |
| 40–41 | arka plan ve sahne çizimi |
| 50–52 | arayüz (HUD, envanter, panel), menüler ve oyun akışı, klavye ve fare |
| 99 | ana döngü ve açılış |

## Test araçları (`build/test/`)
Node 22+ ve `google-chrome` gerekir. Önce `python3 build.py --no-music`.
- `node build/test/smoke.mjs [harita,harita,...]`: her haritayı Yaratıcı modda açar, kule kurar, tüm güç ve eşyaları kullanır, boss dalgasına atlar; JS hatalarını ve harita doğrulamasını (yol dışına düşen özel bloklar, çapraz yol vb.) yazar, `build/test/shots/` altına ekran görüntüsü alır.
- `node build/test/balance.mjs harita,harita,... normal > out.txt && python3 build/test/summ.py out.txt`: `bot.js` içindeki bot haritayı baştan sona oynar (kule kurar, yükseltir, onarır, kazar, yetenek kullanır). Kazanma/kaybetme, kaçan yaratık, yıkılan kule ve kulelere en çok hasar veren yaratıkları listeler.

## Denge (son ölçüm, normal zorluk, bot)
40 haritanın 33'ü kazanılıyor. Kaybedilenler çoğunlukla son dalgada veya bossta: Köy Baskını, Antik Şehir, Bazalt Deltaları, Nether Kalesi, Wither Sunağı, Ejderha Adası, Yarık Kanyonu. Zor modda ilk dünyalar kazanılıyor, sonrakiler gerçekten zor.
Ayar noktaları: `TOWER_HP` (10_towers.js), `atkScale` (32_enemies.js), harita `hpm` ve `money` (14–17), dalga sonu onarımı (`waveCleared`, 30_game.js).

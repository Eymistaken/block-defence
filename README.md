# Blok Savunması

Minecraft temalı, tek HTML dosyasından oluşan bir kule savunma oyunu. Dışarıdan hiçbir görsel kullanılmaz; bütün bloklar, kuleler ve yaratıklar kodla çizilir.

**Oyna:** https://block-defence.netlify.app

> A Minecraft-themed tower defense game in a single HTML file, in Turkish. Every block, tower and mob is drawn in code. Play it at the link above.

## İçerik

- **4 boyut, 40 dünya:** Overworld, Nether, End ve Sift; her birinde 10 dünya.
- **Overworld:** ovalar, çöl, tundra, bataklık, mağaralar, Okyanus Anıtı, Köy Baskını, Solgun Bahçe, Karanlık Derinlikler ve Antik Şehir.
  - **Karanlık Derinlikler:** Sculk sensörleri kulelerin titreşimini duyar; uyarı 4'e çıkınca Muhafız ortaya çıkar.
  - **Solgun Bahçe:** Gıcırtılar geceleri kalplerinden doğar. Bakılırken donarlar, ölümsüzdürler; kalbi kazınca ufalanırlar.
- **Nether:** Nether Güncellemesi'nin biyomları, Piglinler, Hoglinler, Bastionlar. Kuleler Netherit ile 5. seviyeye çıkar. En sonda Wither bekler.
- **End:** "End Güncellemesi gelmiş gibi" yeni biyomlar (Nakarat Ormanı, Kristal Dağları, Kehribar Diyarı, Kükürt Kaynakları...). Ejderha en sonda.
- **Sift:** değişen gelgitler (Akış, Direniş, Bereket), ruh ile kullanılan güçler, gökkuşağı renkli Ichor ve korunması gereken Şarkıcı.
- **Yaratıklar kulelere saldırır:** kulelerin canı vardır; onarılır, yıkılır. Örs, Diriltici gibi destek kuleleri vardır.
- **Envanter:** her bölgeye özel 9 yuvalı hızlı erişim çubuğu, 4 yuvalı eşya kemeri, üretim, ve kazanılan eşyaların saklandığı Sandık.
- Büyü Masası (kalıcı yükseltmeler), 36 başarım, ansiklopedi, Kolay/Normal/Zor/Yaratıcı zorluklar ve Sonsuz mod.

İlerleme tarayıcının `localStorage`'ına kaydedilir.

## Kontroller

| Tuş | İş |
|---|---|
| `1`–`9`, fare tekerleği | hızlı erişim çubuğundan kule seç |
| Sol tık / Shift+tık | yerleştir, seç, kaz / art arda yerleştir |
| Sağ tık, `Esc` | iptal |
| `Tab`, `I` | envanter |
| `Boşluk` | dalgayı başlat / erken çağır |
| `U` `O` `S` `H` | seçili kuleyi yükselt / onar / sat / hedef modunu değiştir |
| `Q` `W` `E` `R` | TNT Yağmuru, Kar Fırtınası, Demir Golem, Altın Elma |
| `T` (Sift'te `Y` `G`) | bölge gücü |
| `Z` `X` `C` `V` | kemerdeki eşyalar |
| `F`, `P` | oyun hızı, duraklat |

## Derleme

Kaynak `src/` altındadır; `build.py` hepsini tek bir HTML dosyasında birleştirir.

```bash
python3 build.py --site       # dist/index.html — yayınlanan sürüm (müziksiz)
python3 build.py --no-music   # build/test.html — hızlı test sürümü
python3 build.py              # block-defence.html — C418 müzikleri gömülü yerel sürüm
```

Müzikli sürüm için `musics/` klasöründe C418 parçalarının `.opus` dosyaları ve `ffmpeg` gerekir. Parçaların hangi dünyada çaldığı `musics/muzik-haritasi.md` dosyasında yazar.

## Müzik hakkında

C418'in parçaları telif hakkıyla korunduğu için bu depoda ve yayındaki sitede **yer almaz**. Yayındaki oyun kendi ürettiği prosedürel müziği çalar.

## Testler

`build/test/` altında headless Chrome ile çalışan iki araç var (Node 22+ ve `google-chrome` gerekir):

- `smoke.mjs`: 40 dünyanın her birini otomatik oynatır, hata ve harita doğrulaması yapar.
- `balance.mjs`: bir bot dünyaları baştan sona oynar ve denge raporu çıkarır.

Ayrıntılar `build/NOTLAR.md` dosyasında.

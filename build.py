#!/usr/bin/env python3
"""Blok Savunması derleyicisi.

src/ altındaki HTML, CSS ve JS parçalarını tek bir HTML dosyasında birleştirir
ve musics/ klasöründeki C418 parçalarını base64 olarak gömer.

Kullanım:
    python3 build.py              # block-defence.html (müzikli, tam sürüm; yalnızca yerel kullanım)
    python3 build.py --no-music   # build/test.html (müziksiz, hızlı test sürümü)
    python3 build.py --site       # dist/index.html (müziksiz; Netlify'da yayınlanan sürüm)

Müzikler ffmpeg ile yeniden kodlanır (Opus, BITRATE) ve build/music-cache/
altında önbelleğe alınır; ikinci derleme anında biter.
"""
import base64
import concurrent.futures
import hashlib
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
MUSIC_DIR = os.path.join(ROOT, 'musics')
CACHE = os.path.join(ROOT, 'build', 'music-cache')
OUT_FULL = os.path.join(ROOT, 'block-defence.html')
OUT_TEST = os.path.join(ROOT, 'build', 'test.html')
OUT_SITE = os.path.join(ROOT, 'dist', 'index.html')

# Opus bit hızı. 48k stereo, C418'in sakin parçaları için temiz bir sonuç verir
# ve 31 parçanın tamamı tam uzunlukta gömülebilir. Daha küçük dosya için 32k,
# daha yüksek kalite için 64k yazılabilir.
BITRATE = '48k'

# anahtar -> (dosya adının başı, en fazla saniye ya da None)
# Alpha: muzik-haritasi.md'ye göre zafer ekranında yalnızca ilk dakikalar çalınır.
TRACKS = {
    'minecraft': ('Minecraft [', None),
    'mutation': ('Mutation [', None),
    'sweden': ('Sweden [', None),
    'clark': ('Clark [', None),
    'aria_math': ('Aria Math [', None),
    'dreiton': ('Dreiton [', None),
    'equinoxe': ('Équinoxe [', None),
    'mice_on_venus': ('Mice on Venus [', None),
    'dry_hands': ('Dry Hands [', None),
    'kyoto': ('Kyoto [', None),
    'wet_hands': ('Wet Hands [', None),
    'haggstrom': ('Haggstrom [', None),
    'excuse': ('Excuse [', None),
    'key': ('Key [', None),
    'flake': ('Flake [', None),
    'concrete_halls': ('Concrete Halls [', None),
    'dead_voxel': ('Dead Voxel [', None),
    'warmth': ('Warmth [', None),
    'ballad_of_the_cats': ('Ballad of the Cats [', None),
    'the_end': ('The End [', None),
    'alpha': ('Alpha [', 180),
    'floating_trees': ('Floating Trees [', None),
    'axolotl': ('Axolotl [', None),
    'dragon_fish': ('Dragon Fish [', None),
    'subwoofer_lullaby': ('Subwoofer Lullaby [', None),
    'moog_city_2': ('Moog City 2 [', None),
    'mall': ('Mall [', None),
    'ki': ('Ki [', None),
    'eleven': ('Eleven [', None),
    'thirteen': ('Thirteen [', None),
    'ward': ('Ward [', None),
}


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def find_source(prefix):
    for name in sorted(os.listdir(MUSIC_DIR)):
        if name.startswith(prefix) and name.endswith('.opus'):
            return os.path.join(MUSIC_DIR, name)
    raise SystemExit(f'Müzik bulunamadı: {prefix}*.opus')


def encode(key):
    prefix, max_sec = TRACKS[key]
    src = find_source(prefix)
    st = os.stat(src)
    tag = hashlib.sha1(f'{src}|{st.st_size}|{st.st_mtime_ns}|{BITRATE}|{max_sec}'.encode()).hexdigest()[:12]
    out = os.path.join(CACHE, f'{key}-{tag}.opus')
    if not os.path.exists(out):
        cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src, '-vn', '-map_metadata', '-1']
        if max_sec:
            cmd += ['-t', str(max_sec), '-af', f'afade=t=out:st={max_sec - 8}:d=8']
        cmd += ['-c:a', 'libopus', '-b:a', BITRATE, '-vbr', 'on', '-application', 'audio',
                '-compression_level', '10', out + '.tmp.opus']
        subprocess.run(cmd, check=True)
        os.replace(out + '.tmp.opus', out)
    with open(out, 'rb') as f:
        data = f.read()
    title = os.path.basename(src).split(' [')[0]
    return key, title, data


def music_block():
    os.makedirs(CACHE, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        results = list(ex.map(encode, TRACKS))
    parts = ['<!-- C418 müzikleri (Opus, base64). Oyun bunları gerektiğinde çözer. -->']
    total = 0
    for key, title, data in results:
        total += len(data)
        b64 = base64.b64encode(data).decode('ascii')
        parts.append(f'<script type="application/octet-stream" id="mus-{key}" data-title="{title}">{b64}</script>')
    print(f'  müzik: {len(results)} parça, {total / 1e6:.1f} MB ham, ~{total * 4 / 3 / 1e6:.1f} MB base64')
    return '\n'.join(parts)


def build(with_music, out=None):
    html = read(os.path.join(SRC, 'index.html'))
    css = read(os.path.join(SRC, 'css', 'main.css'))
    js_dir = os.path.join(SRC, 'js')
    js_files = sorted(f for f in os.listdir(js_dir) if f.endswith('.js'))
    js = '\n'.join(f'/* ===== {f} ===== */\n' + read(os.path.join(js_dir, f)) for f in js_files)
    html = html.replace('/*@CSS@*/', css).replace('/*@JS@*/', js)
    html = html.replace('<!--@MUSIC@-->', music_block() if with_music else '<!-- müziksiz test sürümü -->')
    out = out or (OUT_FULL if with_music else OUT_TEST)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  {len(js_files)} JS dosyası, {len(js) / 1e3:.0f} KB kod')
    print(f'  yazıldı: {os.path.relpath(out, ROOT)} ({os.path.getsize(out) / 1e6:.1f} MB)')


if __name__ == '__main__':
    if '--site' in sys.argv:
        # C418 parçaları telifli olduğu için herkese açık sürüm müziksizdir;
        # oyun bu durumda kendi prosedürel müziğini çalar.
        build(False, OUT_SITE)
    else:
        build('--no-music' not in sys.argv)


<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>ぬりえ：空想どうぶつジェネレーター</title>
  <link.css
</head>
<body>
  <header>
    <h1>ぬりえ：どうぶつ合成（線画）</h1>
    <p>太く均一の黒線／背景白／正方形／中央配置</p>
  </header>

  <section class="controls">
    <label>動物1：
      <select id="animal1">
        <option value="tanuki" selected>たぬき</option>
        <option value="nezumi">ねずみ</option>
        <option value="neko">ねこ</option>
        <option value="usagi">うさぎ</option>
      </select>
    </label>
    <label>動物2：
      <select id="animal2">
        <option value="nezumi" selected>ねずみ</option>
        <option value="tanuki">たぬき</option>
        <option value="inu">いぬ</option>
        <option value="kitsune">きつね</option>
      </select>
    </label>
    <label>ポーズ：
      <select id="pose">
        <option value="sit" selected>座る</option>
        <option value="stand">立つ</option>
      </select>
    </label>
    <button id="generateBtn">イラストを生成</button>
    <button id="downloadSvgBtn">SVGで保存</button>
    <button id="downloadPngBtn">PNGで保存</button>
  </section>

  <!-- 正方形キャンバス（線画のみ） -->
  <div class="canvas-wrapper">
    <svg id="canvas" viewBox="0 0 1000 1000" width="600" height="600"
         aria-label="ぬりえイラスト" role="img"></svg>
  </div>

  <footer>
    <small>© 2025 Coloring Hybrid Animals</small>
  </footer>

  app.js</script>
</body>


:root {
  /* 太く均一の黒線（全パーツで共通設定） */
  --stroke: #000000;
  --stroke-width: 22;
}

* { box-sizing: border-box; }
body {
  margin: 24px;
  font-family: system-ui, "Hiragino Sans", "Noto Sans JP", sans-serif;
  color: #111;
  background: #fff; /* 背景は真っ白 */
}

header h1 { margin: 0 0 6px; font-weight: 700; }
header p { margin: 0 0 16px; color: #444; }

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
label { display: flex; gap: 8px; align-items: center; }
select, button {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
button:hover { background: #f5f5f5; }

.canvas-wrapper {
  display: grid;
  place-items: center;
}
#canvas {
  background: #ffffff;       /* 白背景（塗りは描かない） */
  border: 2px solid #eee;     /* 見やすさ用の外枠（作品には含まれません） */
}
footer { margin-top: 16px; color: #777; }


// 共通の線設定
const CANVAS = document.getElementById('canvas');
const BTN_GEN = document.getElementById('generateBtn');
const BTN_SVG = document.getElementById('downloadSvgBtn');
const BTN_PNG = document.getElementById('downloadPngBtn');

const STROKE = getComputedStyle(document.documentElement).getPropertyValue('--stroke').trim();
const STROKE_WIDTH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stroke-width'));

// === SVGユーティリティ ===
function clearCanvas() { while (CANVAS.firstChild) CANVAS.removeChild(CANVAS.firstChild); }

function add(el) { CANVAS.appendChild(el); return el; }

function path(d) {
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);
  p.setAttribute('fill', 'none');
  p.setAttribute('stroke', STROKE);
  p.setAttribute('stroke-width', STROKE_WIDTH);
  p.setAttribute('stroke-linecap', 'round');
  p.setAttribute('stroke-linejoin', 'round');
  return p;
}

function circle(cx, cy, r) {
  const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
  c.setAttribute('fill', 'none');
  c.setAttribute('stroke', STROKE);
  c.setAttribute('stroke-width', STROKE_WIDTH);
  return c;
}

function ellipse(cx, cy, rx, ry) {
  const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  e.setAttribute('cx', cx); e.setAttribute('cy', cy);
  e.setAttribute('rx', rx); e.setAttribute('ry', ry);
  e.setAttribute('fill', 'none');
  e.setAttribute('stroke', STROKE);
  e.setAttribute('stroke-width', STROKE_WIDTH);
  return e;
}

function line(x1, y1, x2, y2) {
  const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l.setAttribute('x1', x1); l.setAttribute('y1', y1);
  l.setAttribute('x2', x2); l.setAttribute('y2', y2);
  l.setAttribute('stroke', STROKE);
  l.setAttribute('stroke-width', STROKE_WIDTH);
  l.setAttribute('stroke-linecap', 'round');
  return l;
}

// === 描画ロジック ===
// たぬき＋ねずみ：両方の特徴が分かるように
// ・たぬきの「お面」輪郭
// ・ねずみの大きめ丸耳＆長いしっぽ
// ・体は丸み、塗りなし、太線のみ
function drawTanukiNezumi(pose = 'sit') {
  clearCanvas();

  // 体（正面・楕円）中央に大きく
  add(ellipse(500, 590, 260, 300));

  // 前足（左右）
  add(path(`M380 640 C 390 720, 420 800, 460 840`));
  add(path(`M620 640 C 610 720, 580 800, 540 840`));
  // 足先の丸み（線のみ）
  add(path(`M435 860 Q 450 870 470 860`));
  add(path(`M515 860 Q 530 870 550 860`));

  // 後足（座り or 立ち）
  if (pose === 'sit') {
    add(path(`M360 760 Q 330 820 380 860`));
    add(path(`M640 760 Q 670 820 620 860`));
  } else {
    // 立ち：短く踏ん張る線
    add(line(380, 800, 430, 860));
    add(line(620, 800, 570, 860));
  }

  // 頭（楕円）
  add(ellipse(500, 360, 230, 180));

  // たぬきのお面輪郭（塗りなし）
  add(path(`
    M380 360
    C 420 320, 580 320, 620 360
    C 580 400, 420 400, 380 360 Z
  `));

  // 目（ねずみの丸目）
  add(circle(460, 360, 34));
  add(circle(540, 360, 34));

  // 鼻＋口（最小限の記号化）
  add(circle(500, 400, 20));
  add(path(`M500 420 Q 500 440 520 450`));

  // 大きめ丸耳（ねずみ）
  add(circle(380, 260, 70));
  add(circle(620, 260, 70));
  add(circle(380, 260, 40)); // 内側線
  add(circle(620, 260, 40));

  // たぬきの頬ふさ（外周ラインでニュアンス）
  add(path(`M360 470 Q 330 500 350 520`));
  add(path(`M640 470 Q 670 500 650 520`));

  // 長いしっぽ（ねずみ）
  add(path(`M720 620 Q 820 680 860 620 Q 800 700 860 760`));
}

// ※他の合成を増やす場合は drawXxx() を追加して分岐させる
function drawBySelection() {
  const a1 = document.getElementById('animal1').value;
  const a2 = document.getElementById('animal2').value;
  const pose = document.getElementById('pose').value;

  // 今回は「たぬき＋ねずみ」をサポート（順不同でOK）
  const key = [a1, a2].sort().join('+');
  if (key === ['tanuki', 'nezumi'].sort().join('+')) {
    drawTanukiNezumi(pose);
  } else {
    clearCanvas();
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', 500); t.setAttribute('y', 500);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('font-size', '36');
    t.textContent = 'この組み合わせは準備中です';
    CANVAS.appendChild(t);
  }
}

// === ダウンロード機能 ===
BTN_SVG.addEventListener('click', () => {
  const svgData = new XMLSerializer().serializeToString(CANVAS);
  const blob = new Blob(
    ['<?xml version="1.0" encoding="UTF-8"?>\n' + svgData],
    { type: 'image/svg+xml;charset=utf-8' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'nurie_hybrid.svg';
  a.click();
  URL.revokeObjectURL(url);
});

// PNG書き出し（背景は白／太線そのまま）
BTN_PNG.addEventListener('click', async () => {
  // SVG → PNG（オフスクリーンcanvas）
  const svgData = new XMLSerializer().serializeToString(CANVAS);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000; canvas.height = 1000; // viewBoxに合わせて正方形
    const ctx = canvas.getContext('2d');
    // 背景白
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob((blob) => {
      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = pngUrl; a.download = 'nurie_hybrid.png';
      a.click();
      URL.revokeObjectURL(pngUrl);
    }, 'image/png', 1.0);
  };
  img.src = url;
});

// 生成ボタン
BTN_GEN.addEventListener('click', drawBySelection);

// 初期描画
drawTanukiNezumi('sit');

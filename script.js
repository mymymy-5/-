// ★ここに OpenAI APIキーを入れる
const OPENAI_API_KEY = "YOUR_API_KEY_HERE";

async function generate() {
  const animal1 = document.getElementById("animal1").value;
  const animal2 = document.getElementById("animal2").value;
  const feature = document.getElementById("feature").value;
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  if (!animal1 || !animal2) {
    alert("動物を2つ入力してね！");
    return;
  }

  loading.classList.remove("hidden");
  result.innerHTML = "";

  const prompt = `
動物の組み合わせで空想動物を作成。
スタイル：ポップ
線画、白背景、中央配置、大きな目、長いまつげ、はっきりした質感
動物1：${animal1}
動物2：${animal2}
追加特徴：${feature}
`;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${OPENAI_API_KEY}\`
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    })
  });

  const data = await response.json();
  const imageUrl = data.data[0].url;

  loading.classList.add("hidden");
  result.innerHTML = \`<img src="\${imageUrl}" alt="生成された空想動物">\`;
}

async function carregarResultado() {
  const res = await fetch('/images');
  const data = await res.json();
  const winnerId = Number(sessionStorage.getItem('winner'));
  const vencedor = data.find(i => i.id === winnerId);

  // ----- vencedora (esquerda)
  const vBox = document.getElementById('vencedora');
  vBox.innerHTML = ""; // limpa

  const vImg = document.createElement('img');
  vImg.src = vencedor.src;
  vImg.alt = "";

  const vId = document.createElement('p');
  vId.className = "name";
  vId.textContent = `ID: ${vencedor.id}`;

  const vScore = document.createElement('p');
  vScore.className = "score";
  vScore.textContent = `Score: ${vencedor.score}`;

  vBox.appendChild(vImg);
  vBox.appendChild(vId);
  vBox.appendChild(vScore);

  // ----- grid ordenado (direita)
  const grid = document.getElementById('grid');
  grid.innerHTML = ""; // limpa

  const ordenados = data
    .slice()
    .sort((a, b) => b.score - a.score || a.id - b.id);

  ordenados.forEach((item) => {
    const card = document.createElement('div');
    card.className = "card";

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = "";

    const idText = document.createElement('div');
    idText.className = "name";
    idText.textContent = `ID: ${item.id}`;

    const score = document.createElement('div');
    score.className = "score";
    score.textContent = `Score: ${item.score}`;

    if (item.id === winnerId) {
      img.style.outline = "3px solid #c00";
      img.style.outlineOffset = "-3px";
    }

    card.appendChild(img);
    card.appendChild(idText);
    card.appendChild(score);
    grid.appendChild(card);
  });

  document.getElementById('reiniciar').onclick = () => location.href = 'index.html';
}

carregarResultado();

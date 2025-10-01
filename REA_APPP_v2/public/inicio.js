// inicio.js
let selecionadas = [];

// embaralhamento Fisher–Yates para estabilidade visual
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateUI() {
  const continuarBtn = document.getElementById('continuar');
  continuarBtn.disabled = selecionadas.length !== 3;

  if (selecionadas.length === 3) {
    document.body.classList.add('max-selecionadas');
  } else {
    document.body.classList.remove('max-selecionadas');
  }
}

function toggleSelection(imgEl) {
  const id = Number(imgEl.dataset.id);

  if (selecionadas.includes(id)) {
    // desmarca
    selecionadas = selecionadas.filter(v => v !== id);
    imgEl.classList.remove('selecionada');
    imgEl.setAttribute('aria-pressed', 'false');
  } else {
    // só marca se ainda houver espaço
    if (selecionadas.length < 3) {
      selecionadas.push(id);
      imgEl.classList.add('selecionada');
      imgEl.setAttribute('aria-pressed', 'true');
    }
  }
  updateUI();
}

async function carregar() {
  // carrega base
  const res = await fetch('/images');
  const data = await res.json();

  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // embaralha visualmente
  const items = shuffle(data);

  // monta grid simples (imgs diretas)
  items.forEach(item => {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = ''; // wireframe minimalista
    img.dataset.id = item.id;
    img.tabIndex = 0; // acessível via teclado
    img.setAttribute('role', 'button');
    img.setAttribute('aria-pressed', 'false');

    img.addEventListener('click', () => toggleSelection(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSelection(img);
      }
    });

    grid.appendChild(img);
  });

  // botão continuar
  const continuarBtn = document.getElementById('continuar');
  continuarBtn.addEventListener('click', async () => {
    if (selecionadas.length !== 3) return;

    // sorteia 1 entre as 3
    const winner = selecionadas[Math.floor(Math.random() * selecionadas.length)];

    // incrementa score no servidor: +1 para cada selecionada, +1 extra para a vencedora
    await fetch('/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selecionadas, winner })
    }).catch(() => { /* silencioso no MVP */ });

    // guarda vencedora só para a tela seguinte
    sessionStorage.setItem('winner', String(winner));

    // vai para o loading
    location.href = 'loading.html';
  });

  // botão Sobre (placeholder – futuro link)
  const btnSobre = document.getElementById('sobre');
  if (btnSobre) {
    btnSobre.addEventListener('click', () => {
      // no futuro: location.href = 'sobre.html';
      // por enquanto, não faz nada (mantendo wireframe)
    });
  }

  // estado inicial
  updateUI();
}

document.addEventListener('DOMContentLoaded', carregar);

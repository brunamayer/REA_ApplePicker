const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET base de imagens
app.get('/images', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(data);
});

// POST incremento de score
app.post('/score', (req, res) => {
  const { ids, winner } = req.body; // ids = array de selecionadas
  if (!ids || !winner) return res.status(400).json({ error: 'Dados inválidos' });

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  ids.forEach(id => {
    const img = data.find(i => i.id === id);
    if (img) img.score += 1;
  });

  const winnerImg = data.find(i => i.id === winner);
  if (winnerImg) winnerImg.score += 1;

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true, data });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

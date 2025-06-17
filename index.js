const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './data.json';

app.use(express.json());
app.use(express.static('public'));

function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/entries', (req, res) => {
  res.json(loadData());
});

app.post('/api/entries', (req, res) => {
  const data = loadData();
  const entry = { ...req.body, date: new Date().toISOString().split('T')[0] };
  data.push(entry);
  saveData(data);
  res.status(201).json(entry);
});

app.delete('/api/entries/:index', (req, res) => {
  const data = loadData();
  const idx = parseInt(req.params.index, 10);
  if (isNaN(idx) || idx < 0 || idx >= data.length) {
    return res.status(404).json({error: 'Entry not found'});
  }
  const removed = data.splice(idx, 1);
  saveData(data);
  res.json(removed[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

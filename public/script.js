async function fetchEntries() {
  const res = await fetch('/api/entries');
  return res.json();
}

function renderEntries(entries) {
  const list = document.getElementById('entries');
  list.innerHTML = '';
  entries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${entry.date}: ${entry.note}`;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = async () => {
      await fetch(`/api/entries/${index}`, { method: 'DELETE' });
      load();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function load() {
  const entries = await fetchEntries();
  renderEntries(entries);
}

document.getElementById('entry-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const note = document.getElementById('note').value;
  await fetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
  document.getElementById('note').value = '';
  load();
});

load();

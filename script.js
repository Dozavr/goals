
let settings = {
  deposit: 0,
  target: 0,
  percent: 0
};
let positions = [];

function saveSettings() {
  settings.deposit = parseFloat(document.getElementById("startDeposit").value);
  settings.target = parseFloat(document.getElementById("targetProfit").value);
  settings.percent = parseFloat(document.getElementById("percentPerTrade").value);
  localStorage.setItem("trackerSettings", JSON.stringify(settings));
  updateStats();
}

function loadSettings() {
  const saved = localStorage.getItem("trackerSettings");
  if (saved) {
    settings = JSON.parse(saved);
    document.getElementById("startDeposit").value = settings.deposit;
    document.getElementById("targetProfit").value = settings.target;
    document.getElementById("percentPerTrade").value = settings.percent;
  }
}

function addPosition() {
  const input = document.getElementById("positionInput");
  const value = parseFloat(input.value);
  if (!isNaN(value)) {
    positions.push(value);
    localStorage.setItem("trackerPositions", JSON.stringify(positions));
    input.value = "";
    updateStats();
    renderPositions();
  }
}

function loadPositions() {
  const saved = localStorage.getItem("trackerPositions");
  if (saved) {
    positions = JSON.parse(saved);
  }
}

function updateStats() {
  const earned = positions.reduce((acc, val) => acc + val, 0);
  const remaining = settings.target - earned;
  const profitPerPos = settings.deposit * (settings.percent / 100);
  const neededPositions = Math.ceil(remaining / profitPerPos);
  const wins = positions.filter(p => p > 0).length;
  const losses = positions.filter(p => p < 0).length;

  document.getElementById("stats").innerHTML = `
    <b>Загальний прибуток:</b> $${earned.toFixed(2)}<br>
    <b>Залишилось до цілі:</b> $${remaining > 0 ? remaining.toFixed(2) : 0}<br>
    <b>Кількість позицій:</b> ${positions.length}<br>
    <b>Наступна цільова позиція:</b> +$${profitPerPos.toFixed(2)}<br>
    <b>Win / Loss:</b> ${wins} / ${losses}
  `;
}

function renderPositions() {
  const container = document.getElementById("positionsList");
  container.innerHTML = "<h3>Позиції:</h3>";
  positions.forEach((p, i) => {
    const color = p >= 0 ? '#22c55e' : '#ef4444';
    container.innerHTML += `<div class="position-item" style="color: ${color}">#${i + 1}: $${p.toFixed(2)}</div>`;
  });
}

window.onload = function() {
  loadSettings();
  loadPositions();
  updateStats();
  renderPositions();
};

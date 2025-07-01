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
  let dynamicDeposit = settings.deposit;
  let earned = 0;

  positions.forEach(p => {
    dynamicDeposit += p;
    earned += p;
  });

  const remaining = settings.target - earned;
  const nextTarget = dynamicDeposit * (settings.percent / 100);
  const neededPositions = nextTarget > 0 ? Math.ceil(remaining / nextTarget) : "-";
  const wins = positions.filter(p => p > 0).length;
  const losses = positions.filter(p => p < 0).length;

  document.getElementById("stats").innerHTML = `
    <b>Поточний депозит:</b> $${dynamicDeposit.toFixed(2)}<br>
    <b>Загальний прибуток:</b> $${earned.toFixed(2)}<br>
    <b>Залишилось до цілі:</b> $${remaining > 0 ? remaining.toFixed(2) : 0}<br>
    <b>Кількість позицій:</b> ${positions.length}<br>
    <b>Наступна цільова позиція (${settings.percent}%):</b> +$${nextTarget.toFixed(2)}<br>
    <b>Win / Loss:</b> ${wins} / ${losses}
  `;
}

function renderPositions() {
  const container = document.getElementById("positionsList");
  container.innerHTML = "<h3>Позиції:</h3>";
  positions.forEach((p, i) => {
    const color = p >= 0 ? '#22c55e' : '#ef4444';
    container.innerHTML += `
      <div class="position-item" style="color: ${color}">
        #${i + 1}: $${p.toFixed(2)}
        <span style="margin-left:10px; color:#ccc; cursor:pointer;" onclick="deletePosition(${i})">✖</span>
      </div>`;
  });
}

function deletePosition(index) {
  positions.splice(index, 1);
  localStorage.setItem("trackerPositions", JSON.stringify(positions));
  updateStats();
  renderPositions();
}


window.onload = function() {
  loadSettings();
  loadPositions();
  updateStats();
  renderPositions();
};


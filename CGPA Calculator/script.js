// ============================================================
//  GradeTrack — CGPA Calculator  |  script.js  (v2.0)
//  Additions: Multiple Grading Scales + Grade Predictor
// ============================================================

// ----------------------------------------------------------
// Grading Scale Definitions
// ----------------------------------------------------------
const GRADING_SCALES = {
  india_10: {
    label: 'India 10-pt (O/A+/A…)',
    max: 10,
    grades: { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0 },
    opts: ['O', 'A+', 'A', 'B+', 'B', 'C', 'F'],
    // pct formula: (cgpa - 0.75) * 10
    toPct: cgpa => ((cgpa - 0.75) * 10).toFixed(1),
    legend: [
      { label: 'O → 10',  bg: 'rgba(200,240,74,0.1)',  bc: 'rgba(200,240,74,0.3)',  col: '#c8f04a' },
      { label: 'A+ → 9', bg: 'rgba(91,156,246,0.1)',  bc: 'rgba(91,156,246,0.3)',  col: '#5b9cf6' },
      { label: 'A → 8',  bg: 'rgba(91,156,246,0.07)', bc: 'rgba(91,156,246,0.2)',  col: '#5b9cf6' },
      { label: 'B+ → 7', bg: 'rgba(167,139,250,0.1)', bc: 'rgba(167,139,250,0.3)', col: '#a78bfa' },
      { label: 'B → 6',  bg: 'rgba(167,139,250,0.07)',bc: 'rgba(167,139,250,0.2)', col: '#a78bfa' },
      { label: 'C → 5',  bg: '',                       bc: '',                      col: '' },
      { label: 'F → 0',  bg: '',                       bc: 'rgba(255,92,92,0.2)',   col: '#ff5c5c' },
    ]
  },
  us_4: {
    label: 'US 4.0 (A/B/C/D/F)',
    max: 4,
    grades: { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 },
    opts: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    toPct: cgpa => (cgpa / 4 * 100).toFixed(1),
    legend: [
      { label: 'A → 4.0',  bg: 'rgba(200,240,74,0.1)',  bc: 'rgba(200,240,74,0.3)',  col: '#c8f04a' },
      { label: 'A- → 3.7', bg: 'rgba(200,240,74,0.07)', bc: 'rgba(200,240,74,0.15)', col: '#c8f04a' },
      { label: 'B+ → 3.3', bg: 'rgba(91,156,246,0.1)',  bc: 'rgba(91,156,246,0.3)',  col: '#5b9cf6' },
      { label: 'B → 3.0',  bg: 'rgba(91,156,246,0.07)', bc: 'rgba(91,156,246,0.2)',  col: '#5b9cf6' },
      { label: 'B- → 2.7', bg: 'rgba(167,139,250,0.1)', bc: 'rgba(167,139,250,0.3)', col: '#a78bfa' },
      { label: 'C+ → 2.3', bg: 'rgba(255,200,80,0.1)',  bc: 'rgba(255,200,80,0.3)',  col: '#ffc850' },
      { label: 'C → 2.0',  bg: 'rgba(255,200,80,0.07)', bc: 'rgba(255,200,80,0.2)',  col: '#ffc850' },
      { label: 'D → 1.0',  bg: 'rgba(255,150,80,0.1)',  bc: 'rgba(255,150,80,0.3)',  col: '#ff965c' },
      { label: 'F → 0.0',  bg: '',                       bc: 'rgba(255,92,92,0.2)',   col: '#ff5c5c' },
    ]
  },
  uk_honours: {
    label: 'UK Honours (First/2:1…)',
    max: 10,
    grades: { 'First': 10, '2:1': 8, '2:2': 6, 'Third': 5, 'Fail': 0 },
    opts: ['First', '2:1', '2:2', 'Third', 'Fail'],
    toPct: cgpa => {
      if (cgpa >= 9.5) return '≥ 70%';
      if (cgpa >= 7.5) return '60–69%';
      if (cgpa >= 5.5) return '50–59%';
      if (cgpa >= 4.5) return '40–49%';
      return '< 40%';
    },
    legend: [
      { label: 'First → 10', bg: 'rgba(200,240,74,0.1)',  bc: 'rgba(200,240,74,0.3)',  col: '#c8f04a' },
      { label: '2:1 → 8',   bg: 'rgba(91,156,246,0.1)',  bc: 'rgba(91,156,246,0.3)',  col: '#5b9cf6' },
      { label: '2:2 → 6',   bg: 'rgba(167,139,250,0.1)', bc: 'rgba(167,139,250,0.3)', col: '#a78bfa' },
      { label: 'Third → 5', bg: 'rgba(255,200,80,0.1)',  bc: 'rgba(255,200,80,0.3)',  col: '#ffc850' },
      { label: 'Fail → 0',  bg: '',                       bc: 'rgba(255,92,92,0.2)',   col: '#ff5c5c' },
    ]
  }
};

let currentScaleKey = 'india_10';
function getScale() { return GRADING_SCALES[currentScaleKey]; }

// ----------------------------------------------------------
// Application State
// ----------------------------------------------------------
let subjects  = [];
let prevSems  = [];
let barChart;
let doughChart;

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------
function gpColor(gp, max) {
  const ratio = max > 0 ? gp / max : 0;
  if (ratio >= 0.9) return { bg: 'rgba(200,240,74,0.12)',  text: '#c8f04a' };
  if (ratio >= 0.8) return { bg: 'rgba(91,156,246,0.12)',  text: '#5b9cf6' };
  if (ratio >= 0.7) return { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa' };
  if (ratio >= 0.5) return { bg: 'rgba(255,200,80,0.12)',  text: '#ffc850' };
  return              { bg: 'rgba(255,92,92,0.12)',   text: '#ff5c5c' };
}

function gradeClass(cgpa, max) {
  const ratio = max > 0 ? cgpa / max : 0;
  if (ratio >= 0.95) return 'Outstanding';
  if (ratio >= 0.9)  return 'Excellent';
  if (ratio >= 0.8)  return 'First Class w/ Dist.';
  if (ratio >= 0.65) return 'First Class';
  if (ratio >= 0.55) return 'Second Class';
  if (ratio >= 0.5)  return 'Pass';
  return 'Fail';
}

// ----------------------------------------------------------
// Scale Switcher
// ----------------------------------------------------------
function changeScale(key) {
  currentScaleKey = key;
  const scale = getScale();

  // Reset subjects grades to first valid option in new scale
  subjects = subjects.map(s => ({
    ...s,
    grade: scale.opts.includes(s.grade) ? s.grade : scale.opts[0]
  }));

  updateLegend();
  renderTable();
  calculate();
  renderPredictorOptions();
}

function updateLegend() {
  const scale = getScale();
  const el = document.getElementById('grade-legend');
  el.innerHTML = scale.legend.map(l => {
    const style = [
      l.bg  ? `background:${l.bg}` : '',
      l.bc  ? `border-color:${l.bc}` : '',
      l.col ? `color:${l.col}` : '',
    ].filter(Boolean).join(';');
    return `<span class="grade-chip" style="${style}">${l.label}</span>`;
  }).join('');
}

// ----------------------------------------------------------
// Table Rendering
// ----------------------------------------------------------
function renderTable() {
  const tbody      = document.getElementById('tbody');
  const emptyState = document.getElementById('empty-state');
  const scale      = getScale();

  if (subjects.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  const totalCredits = subjects.reduce((sum, x) => sum + x.credits, 0);

  tbody.innerHTML = subjects.map((s, i) => {
    const gp     = scale.grades[s.grade] ?? 0;
    const weight = totalCredits > 0 ? ((s.credits / totalCredits) * 100).toFixed(0) : 0;
    const col    = gpColor(gp, scale.max);
    const opts   = scale.opts
      .map(g => `<option value="${g}"${g === s.grade ? ' selected' : ''}>${g}</option>`)
      .join('');

    return `
      <tr>
        <td>
          <input type="text" value="${s.name}"
            onchange="subjects[${i}].name = this.value; updateCharts()">
        </td>
        <td>
          <input type="number" value="${s.credits}"
            min="1" max="6" step="1" class="no-spinners"
            onchange="subjects[${i}].credits = Math.max(1, +this.value); calculate()">
        </td>
        <td>
          <select onchange="subjects[${i}].grade = this.value; calculate()">
            ${opts}
          </select>
        </td>
        <td>
          <span class="gp-badge" style="background:${col.bg}; color:${col.text};">
            ${gp}
          </span>
        </td>
        <td>
          <span style="font-size:11px; font-family:var(--font-mono); color:var(--text2);">
            ${weight}%
          </span>
        </td>
        <td>
          <button class="del-btn"
            onclick="subjects.splice(${i}, 1); renderTable(); calculate()">
            ×
          </button>
        </td>
      </tr>`;
  }).join('');
}

// ----------------------------------------------------------
// Subject Management
// ----------------------------------------------------------
function addRow() {
  const scale = getScale();
  subjects.push({ name: `Subject ${subjects.length + 1}`, credits: 3, grade: scale.opts[2] || scale.opts[0] });
  renderTable();
  calculate();
}

// ----------------------------------------------------------
// Core Calculation
// ----------------------------------------------------------
function calculate() {
  renderTable();
  const scale = getScale();

  const weightedPoints = subjects.reduce((sum, x) => sum + (scale.grades[x.grade] ?? 0) * x.credits, 0);
  const totalCredits   = subjects.reduce((sum, x) => sum + x.credits, 0);
  const sgpa           = totalCredits > 0 ? weightedPoints / totalCredits : 0;

  let allWeightedPoints = weightedPoints;
  let allCredits        = totalCredits;
  prevSems.forEach(p => {
    allWeightedPoints += p.sgpa * p.credits;
    allCredits        += p.credits;
  });

  const cgpa = allCredits > 0 ? allWeightedPoints / allCredits : 0;
  const pct  = cgpa > 0 ? scale.toPct(cgpa) : 0;

  document.getElementById('m-cgpa').textContent        = allCredits > 0 ? cgpa.toFixed(2) : '—';
  document.getElementById('m-sgpa').textContent        = totalCredits > 0 ? sgpa.toFixed(2) : '—';
  document.getElementById('m-pct').textContent         = allCredits > 0 ? pct + (typeof pct === 'string' && pct.includes('%') ? '' : '%') : '—';
  document.getElementById('m-credits').textContent     = allCredits || '—';
  document.getElementById('m-grade-class').textContent = allCredits > 0 ? gradeClass(cgpa, scale.max) : '—';
  document.getElementById('m-sgpa-sub').textContent    = totalCredits > 0 ? `${totalCredits} credits` : '—';
  document.getElementById('m-sub-credits').textContent =
    allCredits > totalCredits
      ? `${totalCredits} this sem + ${allCredits - totalCredits} prior`
      : 'this semester';

  document.getElementById('big-cgpa').textContent     = allCredits > 0 ? cgpa.toFixed(2) : '—';
  document.getElementById('grade-class2').textContent  = allCredits > 0 ? gradeClass(cgpa, scale.max) : '—';
  document.getElementById('sem-count').textContent    = prevSems.length + 1;
  document.getElementById('cgpa-fill').style.width    = allCredits > 0 ? (cgpa / scale.max * 100) + '%' : '0%';

  // Update the scale max label in sidebar
  document.getElementById('cgpa-max-label').textContent = '/ ' + scale.max;

  updateCharts();
  runPredictor();
}

// ----------------------------------------------------------
// Chart Updates
// ----------------------------------------------------------
function updateCharts() {
  const scale   = getScale();
  const labels  = subjects.map(s => s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name);
  const gps     = subjects.map(s => scale.grades[s.grade] ?? 0);
  const credits = subjects.map(s => s.credits);
  const barColors = gps.map(g => gpColor(g, scale.max).text);

  if (barChart) {
    barChart.data.labels                       = labels;
    barChart.data.datasets[0].data             = gps;
    barChart.data.datasets[0].backgroundColor  = barColors.map(c => c + '22');
    barChart.data.datasets[0].borderColor      = barColors;
    barChart.options.scales.y.max              = scale.max;
    barChart.update();
  }

  if (doughChart) {
    doughChart.data.labels             = subjects.map(s => s.name);
    doughChart.data.datasets[0].data   = credits;
    doughChart.update();
  }
}

// ----------------------------------------------------------
// Previous Semesters
// ----------------------------------------------------------
function addPrevSem() {
  const scale   = getScale();
  const sgpa    = parseFloat(document.getElementById('inp-sgpa').value);
  const credits = parseInt(document.getElementById('inp-credits').value, 10);

  if (!isNaN(sgpa) && !isNaN(credits) && sgpa >= 0 && sgpa <= scale.max && credits > 0) {
    prevSems.push({ sgpa, credits });
    renderPrevSems();
    calculate();
    document.getElementById('inp-sgpa').value    = '';
    document.getElementById('inp-credits').value = '';
  }
}

function renderPrevSems() {
  const el = document.getElementById('sem-list');

  if (prevSems.length === 0) {
    el.innerHTML = `<div style="font-size:12px; color:var(--text3); font-family:var(--font-mono); padding:4px 0;">
      No previous semesters added
    </div>`;
    return;
  }

  el.innerHTML = prevSems.map((p, i) => `
    <div class="sem-item">
      <span>Sem ${i + 1}</span>
      <span>${p.sgpa.toFixed(2)} SGPA &nbsp;·&nbsp; ${p.credits} cr</span>
      <button class="del-btn" style="font-size:14px;"
        onclick="prevSems.splice(${i}, 1); renderPrevSems(); calculate()">
        ×
      </button>
    </div>`).join('');
}

// ----------------------------------------------------------
// ✨ GRADE PREDICTOR
// ----------------------------------------------------------

/**
 * Populates the grade dropdowns inside the predictor panel
 * whenever the active scale changes.
 */
function renderPredictorOptions() {
  const scale = getScale();
  ['pred-min-grade', 'pred-target-grade'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const current = el.value;
    el.innerHTML = scale.opts
      .map(g => `<option value="${g}"${g === current ? ' selected' : ''}>${g} (${scale.grades[g]})</option>`)
      .join('');
  });
}

/**
 * Core predictor logic.
 * Reads the target CGPA and remaining credits, then figures out
 * the minimum SGPA needed in the remaining semester(s).
 */
function runPredictor() {
  const scale         = getScale();
  const targetCGPA    = parseFloat(document.getElementById('pred-target').value);
  const remCredits    = parseInt(document.getElementById('pred-rem-credits').value, 10);
  const resultEl      = document.getElementById('pred-result');
  const gradeHintEl   = document.getElementById('pred-grade-hint');

  // Current accumulated state (previous sems + this sem)
  const curWeighted = subjects.reduce((s, x) => s + (scale.grades[x.grade] ?? 0) * x.credits, 0)
    + prevSems.reduce((s, p) => s + p.sgpa * p.credits, 0);
  const curCredits  = subjects.reduce((s, x) => s + x.credits, 0)
    + prevSems.reduce((s, p) => s + p.credits, 0);

  if (isNaN(targetCGPA) || isNaN(remCredits) || remCredits <= 0 ||
      targetCGPA <= 0   || targetCGPA > scale.max) {
    resultEl.textContent    = '—';
    gradeHintEl.textContent = 'Enter a valid target and remaining credits above.';
    gradeHintEl.style.color = 'var(--text3)';
    return;
  }

  const totalCreditsAfter = curCredits + remCredits;
  // required = (target * totalAfter - curWeighted) / remCredits
  const requiredSGPA = (targetCGPA * totalCreditsAfter - curWeighted) / remCredits;

  resultEl.textContent = requiredSGPA > 0 ? requiredSGPA.toFixed(2) : '0.00';

  if (requiredSGPA > scale.max) {
    resultEl.style.color    = 'var(--red)';
    gradeHintEl.textContent = `Not achievable — you'd need ${requiredSGPA.toFixed(2)} which exceeds the max of ${scale.max}.`;
    gradeHintEl.style.color = 'var(--red)';
  } else if (requiredSGPA <= 0) {
    resultEl.style.color    = '#c8f04a';
    gradeHintEl.textContent = `You've already met your target! Keep it up. 🎉`;
    gradeHintEl.style.color = '#c8f04a';
  } else {
    resultEl.style.color = '#c8f04a';

    // Find the closest grade in the scale that meets the requirement
    const achievableGrade = scale.opts.find(g => scale.grades[g] >= requiredSGPA);
    if (achievableGrade) {
      gradeHintEl.textContent = `You need at least "${achievableGrade}" grade average across remaining ${remCredits} credits.`;
      gradeHintEl.style.color = 'var(--text2)';
    } else {
      gradeHintEl.textContent = `Requires a SGPA of ${requiredSGPA.toFixed(2)} across ${remCredits} credits.`;
      gradeHintEl.style.color = 'var(--text2)';
    }
  }
}

// ----------------------------------------------------------
// Utility Actions
// ----------------------------------------------------------
function clearAll() {
  if (!confirm('Clear all data?')) return;
  subjects  = [];
  prevSems  = [];
  renderTable();
  renderPrevSems();
  calculate();
}

function exportData() {
  const data = { scaleKey: currentScaleKey, subjects, prevSems, exported: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'cgpa-data.json';
  a.click();
}

// ----------------------------------------------------------
// Chart Initialisation
// ----------------------------------------------------------
window.addEventListener('load', () => {
  const gridColor = 'rgba(255,255,255,0.05)';
  const tickColor = '#555';

  barChart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        data: [], backgroundColor: [], borderColor: [],
        borderWidth: 1, borderRadius: 6, borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0, max: 10,
          ticks: { color: tickColor, font: { size: 11 }, stepSize: 2 },
          grid:  { color: gridColor }
        },
        x: {
          ticks: { color: tickColor, font: { size: 11 } },
          grid:  { display: false }
        }
      }
    }
  });

  doughChart = new Chart(document.getElementById('doughChart'), {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#c8f04a','#5b9cf6','#a78bfa','#ff8c5c','#ffc850','#5dcaa5','#f4809a'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '62%',
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#777', font: { size: 11 }, boxWidth: 10, padding: 10 }
        }
      }
    }
  });

  updateLegend();
  renderPredictorOptions();
  // loadSample(); // Commented out to start with empty data
});
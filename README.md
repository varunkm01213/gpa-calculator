# GradeTrack — CGPA Calculator & Analytics

> A sleek, dark-themed CGPA calculator with multi-scale grading support, grade prediction, and real-time analytics — built with vanilla HTML, CSS, and JavaScript.

![Version](https://img.shields.io/badge/version-2.0.0-c8f04a?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-5b9cf6?style=flat-square)
![Built With](https://img.shields.io/badge/built%20with-HTML%20%7C%20CSS%20%7C%20JS-a78bfa?style=flat-square)

---

## 📸 Overview

GradeTrack helps students accurately calculate their SGPA and CGPA, visualise subject performance, and predict the grades they need to hit their academic targets — all in a fast, no-install, browser-based tool.

---

## ✨ Features

### Core
- **SGPA & CGPA calculation** — credit-weighted computation with live updates as you type
- **Previous semester tracking** — add past semesters by SGPA + credits to factor into your overall CGPA
- **Percentage equivalent** — auto-converted using the formula appropriate to your grading scale
- **Grade class label** — Outstanding / Excellent / First Class / Second Class / Pass / Fail

### 🌐 Multiple Grading Scales *(v2.0)*
Switch between three grading systems from the header dropdown — the entire app recalculates instantly:

| Scale | Grades | Max |
|---|---|---|
| **India 10-pt** | O / A+ / A / B+ / B / C / F | 10.0 |
| **US 4.0** | A / A- / B+ / B / B- / C+ / C / C- / D / F | 4.0 |
| **UK Honours** | First / 2:1 / 2:2 / Third / Fail | 10.0 |

### 🎯 Grade Predictor *(v2.0)*
Enter your **target CGPA** and **remaining credits** — the predictor instantly shows:
- The minimum SGPA you need across remaining semesters
- The closest grade label that achieves it (e.g. *"You need at least 'A+' average"*)
- A clear warning if the target is mathematically out of reach

### 📊 Visual Analytics
- **Bar chart** — grade points per subject, colour-coded by performance
- **Doughnut chart** — credit distribution across subjects
- **CGPA progress bar** — animated fill relative to the scale maximum

### 🛠 Utilities
- **Export JSON** — save your subjects and semester history as a `.json` file
- **Load sample data** — one-click demo to explore the UI
- **Clear all** — reset everything with confirmation
- Fully **responsive** — works on mobile and desktop

---

## 🚀 Getting Started

No build tools, no dependencies to install. Just open the file.

```bash
git clone https://github.com/your-username/gradetrack.git
cd gradetrack
open index.html      # macOS
# or double-click index.html on Windows / Linux
```

That's it — the calculator runs entirely in the browser.

### File Structure

```
gradetrack/
├── index.html      # Markup + styles
├── script.js       # All application logic
└── README.md
```

---

## 🧮 How the Math Works

**SGPA** (current semester):
```
SGPA = Σ(grade_point × credits) / Σ(credits)
```

**CGPA** (across all semesters):
```
CGPA = Σ(SGPA_i × credits_i) / Σ(credits_i)
```

**Percentage conversion** (India 10-pt scale):
```
Percentage ≈ (CGPA − 0.75) × 10
```

**Grade Predictor** — minimum SGPA needed:
```
required_SGPA = (target_CGPA × total_credits_after − current_weighted_points) / remaining_credits
```

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | [Chart.js 4.4](https://www.chartjs.org/) via CDN |
| Fonts | [Syne](https://fonts.google.com/specimen/Syne) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) via Google Fonts |

Zero frameworks. Zero build steps.

---

## 🗺 Roadmap

- [ ] `localStorage` persistence — save data between sessions
- [ ] Export as PDF / printable transcript
- [ ] University preset templates (Anna University, VTU, Mumbai University…)
- [ ] Semester-wise GPA trend line chart
- [ ] Backlog / arrear impact calculator
- [ ] Dark / light theme toggle
- [ ] Import JSON to restore a previous session

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please keep PRs focused — one feature or fix per PR makes review much easier.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Made for students, by a student. If GradeTrack helped you, leave a ⭐ on the repo!

<div align="center">

# 🎓 Sistema-Escolar

### Academic management panel: universities, classes, students, rubrics, and grades.

A web app to manage the day-to-day of a professor or institution: load universities, courses, students, and **weighted evaluation rubrics** to compute grades instantly, all with an analytics dashboard.

**[🚀 Live Demo](https://juan-bot.github.io/Sistema-Escolar/)**

![Version](https://img.shields.io/badge/version-1.0.0-059669) ![React](https://img.shields.io/badge/React-18-61dafb) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952b3) ![Chart.js](https://img.shields.io/badge/Chart.js-4-ff6384) ![Vite](https://img.shields.io/badge/Vite-5-646cff)

</div>

---

## ✨ Modules

### 🏛 Universities
- Create, edit, and delete universities with acronym, color, and identifying icon.

### 📚 Classes
- Courses grouped by university: **code, semester, schedule, and classroom**.
- Quick filter by institution.

### 👥 Students
- Register with **enrollment ID, name, and email**, assigned to a class.
- **Live search** and filters by university/class.

### ⚖️ Assessment rubrics
- Full rubric editor with **criteria, weights, and max score**.
- Created per class and reusable.

### 🧮 Grades
- Bulk grade entry per rubric directly in a table.
- **Automatic weighted-average calculation** per student based on each criterion's weight.

### 📊 Analytics dashboard
- **Chart.js graphics**: student bars per university and **donut** of course distribution.
- Summary cards (universities, classes, students, rubrics).

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | **React 18 + Vite 5** |
| Routing | **React Router (HashRouter)** |
| UI | **React-Bootstrap 5 + Bootstrap** |
| Charts | **Chart.js + react-chartjs-2** |
| State | **React Context** with `localStorage` persistence |
| Seed data | Initial demo data (`sampleData.js`) |

---

## 🚀 Getting Started

```bash
git clone https://github.com/juan-bot/Sistema-Escolar.git
cd Sistema-Escolar
npm install
npm run dev
```

Open http://localhost:5173 in your browser. The app ships with **sample data** preloaded so you can explore it right away.

```bash
npm run build && npm run preview   # production build
```

---

## 📁 Project Structure

```
src/
├── App.jsx                 # Routes and main layout
├── context/AppContext.jsx  # Global state + localStorage persistence
├── data/sampleData.js      # Initial sample data
└── components/
    ├── Dashboard/          # Summary and charts
    ├── Universities/       # School management
    ├── Classes/            # Class management
    ├── Students/           # Student management
    ├── Rubrics/            # Rubric editor
    └── Grades/             # Grade calculation
```

---

## 📄 License

Private use project. Please ask before redistributing it.
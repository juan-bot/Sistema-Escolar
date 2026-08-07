<div align="center">

# 🎓 Sistema-Escolar

### Panel de gestión académica: universidades, clases, alumnos, rúbricas y calificaciones.

Aplicación web para administrar el día a día de un profesor o institución: cargá universidades, asignaturas, estudiantes y **rúbricas con criterios ponderados** para calcular calificaciones al instante, todo con un dashboard analítico.

**[🚀 Demo en vivo](https://juan-bot.github.io/Sistema-Escolar/)**

![Version](https://img.shields.io/badge/version-1.0.0-059669) ![React](https://img.shields.io/badge/React-18-61dafb) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952b3) ![Chart.js](https://img.shields.io/badge/Chart.js-4-ff6384) ![Vite](https://img.shields.io/badge/Vite-5-646cff)

</div>

---

## ✨ Módulos

### 🏛 Universidades
- Alta, edición y baja de universidades con acrónimo, color e ícono identificador.

### 📚 Clases
- Asignaturas agrupadas por universidad: **código, semestre, horario y aula**.
- Filtro rápido por institución.

### 👥 Alumnos
- Registro con **matrícula, nombre y correo**, asignación a clase.
- **Búsqueda en vivo** y filtros por universidad/clase.

### ⚖️ Rúbricas de evaluación
- Editor completo de rúbricas con **criterios, pesos y puntaje máximo**.
- Creadas por clase y reutilizables.

### 🧮 Calificaciones
- Carga masiva de notas por rúbrica directamente en una tabla.
- **Cálculo automático de promedio ponderado** por alumno según los pesos de cada criterio.

### 📊 Dashboard analítico
- **Gráficas con Chart.js**: barras de alumnos por universidad y **donut** de distribución de asignaturas.
- Tarjetas de resumen (universidades, clases, alumnos, rúbricas).

---

## 🧰 Stack

| Capa | Tecnología |
|---|---|
| Frontend | **React 18 + Vite 5** |
| Enrutado | **React Router (HashRouter)** |
| UI | **React-Bootstrap 5 + Bootstrap** |
| Gráficos | **Chart.js + react-chartjs-2** |
| Estado | **React Context** con persistencia en `localStorage` |
| Datos demo | Seed inicial (`sampleData.js`) |

---

## 🚀 Getting Started

```bash
git clone https://github.com/juan-bot/Sistema-Escolar.git
cd Sistema-Escolar
npm install
npm run dev
```

Abrí http://localhost:5173 en tu navegador. La app viene con **datos de ejemplo** precargados para que puedas explorarla de inmediato.

```bash
npm run build && npm run preview   # build de producción
```

---

## 📁 Estructura del proyecto

```
src/
├── App.jsx                 # Rutas y layout principal
├── context/AppContext.jsx  # Estado global + persistencia localStorage
├── data/sampleData.js      # Datos de ejemplo iniciales
└── components/
    ├── Dashboard/          # Resumen y gráficas
    ├── Universities/       # Gestión de universidades
    ├── Classes/            # Gestión de clases
    ├── Students/           # Gestión de alumnos
    ├── Rubrics/            # Editor de rúbricas
    └── Grades/             # Cálculo de calificaciones
```

---

## 📄 Licencia

Proyecto de uso privado. Consultá antes de redistribuirlo.
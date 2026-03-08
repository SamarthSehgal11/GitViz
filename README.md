# 🌌 GitViz - GitHub History Visualizer

![GitViz Preview](https://img.shields.io/badge/UI-Dark_Cosmos-0c0f14?style=flat-square&logo=react&logoColor=58a6ff)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square&logo=react)
![D3.js](https://img.shields.io/badge/D3.js-v7-f9a03c?style=flat-square&logo=d3.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

**GitViz** is a real-time, aesthetically driven React application that transforms public GitHub repository data into beautiful, interactive visual insights. Built with **D3.js v7** and styled with a premium glassmorphism UI, it provides deep analysis without requiring any authentication.

## ✨ Features

- **🌠 Premium UI:** A stunning, space-themed aesthetic featuring canvas particle backgrounds, deep `#050709` tones, glowing neon accents, and smooth cinematic transitions.
- **📈 Commit Timeline:** Interactive SVG timeline mapping the density (additions/deletions) of a repository's history, complete with a pulsating activity ring on the latest node and native floating zoom controls.
- **🥇 Top Contributors:** Staggered, linear-gradient D3 bar charts visualizing the top 10 contributors, embedding their GitHub avatars and calculating percentage impacts dynamically.
- **🔥 Activity Heatmap:** A classic GitHub-style 52-week commit density heatmap, matched exactly to the official dark mode color palette with reactive CSS scaling bounds on hover.
- **🚀 Zero Auth Required:** Directly queries the public GitHub REST API. Just paste a repository URL (e.g., `facebook/react`) and visualize.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **Data Visualization:** D3.js (v7)
- **Styling:** Tailwind CSS, Vanilla CSS Variables (`index.css`), Glassmorphism
- **Icons:** Lucide React
- **Data:** GitHub REST API

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js (v20+) installed on your machine.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SamarthSehgal11/GitViz.git
cd GitViz
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`.

## 🎨 Design System

GitViz utilizes a strict `Space Grotesk` (Display) and `JetBrains Mono` (Monospace) typography hierarchy. All UI components heavily leverage CSS `backdrop-filter: blur(12px)` for premium glass card aesthetics, avoiding flat generic colors in favor of `--accent-blue` (`#58a6ff`) and `--accent-purple` (`#bc8cff`) gradients.

## 👨‍💻 Author

**Samarth Sehgal**  
*Computer Science Engineer · Web Developer*  
- [GitHub Profile](https://github.com/SamarthSehgal11)
- Contact: Samarthsehgal19@gmail.com

---
*Built with ❤️ for data visualization and beautiful interfaces.*

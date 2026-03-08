# GitViz
A GitHub repository history visualizer built with React and D3.js

[![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-purple?style=flat-square)](https://vitejs.dev)
[![D3](https://img.shields.io/badge/D3.js-v7-orange?style=flat-square)](https://d3js.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)

![GitViz](./preview.png)

## Overview
GitViz transforms raw repository data into interactive visual insights. It queries the public GitHub REST API to render commit timelines, contributor rankings, and 52-week activity heatmaps natively in the browser. 

## Features
- Search any public GitHub repository by URL or owner/repo shorthand
- Interactive commit timeline with zoom and pan
- Top contributors ranked by commit count
- Activity heatmap showing the last 52 weeks of commits
- Repo metadata: stars, forks, open issues, primary language

## Tech Stack
| Technology | Purpose |
| ---------- | ------- |
| React 18 | UI framework |
| Vite | Build tool |
| D3.js v7 | Data visualizations |
| GitHub REST API | Data source |

## Getting Started

```bash
git clone https://github.com/SamarthSehgal11/gitviz.git
cd gitviz
npm install
npm run dev
```

## Usage
Paste a full public GitHub repository URL into the search input and click Visualize to generate the charts. The system also accepts the standard owner/repo shorthand (e.g., facebook/react). 

## Limitations
The standard GitHub API configuration limits unauthenticated requests to 60 per hour. Currently, only public repositories are supported, and the visualizer maps the 100 most recent chronologically ordered commits of the target branch.


## Contributing
Fork the repository, create a feature branch, and submit a pull request with your proposed changes.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

## Author
Samarth Sehgal   
Samarthsehgal19@gmail.com  
github.com/SamarthSehgal11  
Open to internship and collaboration opportunities.  

## License
MIT

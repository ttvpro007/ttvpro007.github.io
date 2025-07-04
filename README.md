# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Portfolio

This is a skeleton portfolio built with React + Vite, designed for easy extensibility, updates, and navigation. Perfect for hosting on GitHub Pages.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```

## Structure

- `src/components/` — Reusable UI components (e.g., Navbar)
- `src/pages/` — Main pages (Home, About, Projects, Contact)
- `src/data/` — Data files (e.g., `projects.json` for your projects)

## Adding Projects

Edit `src/data/projects.json` to add, update, or remove projects. The Projects page will update automatically.

## Extending

- Add new pages in `src/pages/` and update the Navbar as needed.
- Add new data files in `src/data/` for other sections (e.g., experience, blog).
- Customize styles in `src/index.css` or add your own CSS modules.

## Deployment

You can deploy this site to GitHub Pages or any static hosting provider.

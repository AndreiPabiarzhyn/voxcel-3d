# Voxcel 3D

A voxel 3D editor for kids (6–10) — build 3D models out of cubes, complete
small guided challenges, and save your creations. Built as the natural next
step after Minecraft-skin and pixel-art style tools for the same audience.

**[Play it live →](https://andreipabiarzhyn.github.io/voxcel-3d/)**

## Features

- **Place / paint / erase** cubes on a 3D grid with a simple color palette.
- **Undo / redo**, keyboard shortcuts included.
- **Camera controls** — orbit, pan (right-click drag), zoom, plus one-click
  front/top/reset view presets (a true straight-down top view included).
- **Challenges** — a handful of small guided builds (house, tree, an Among Us
  character) with a translucent "ghost" overlay in the grid showing exactly
  what's left to place, a hint toggle, and automatic completion detection.
- **Save your work**:
  - `.voxcel` — a re-editable JSON project file (open it again later).
  - `.glb` — a real 3D model export (drop it into a game engine).
  - `.png` — a quick screenshot of your build.
  - Autosave to the browser's local storage, so a refresh never loses work.
- **8 languages** — English (default), Polski, Italiano, Español, Türkçe,
  Русский, Português, Bahasa Indonesia. Switch anytime from the globe button.
- Local-first: no accounts, no backend, nothing leaves your browser.

## Tech stack

React + TypeScript + Vite, [`@react-three/fiber`](https://r3f.docs.pmnd.rs/)
and [`@react-three/drei`](https://github.com/pmndrs/drei) for the 3D scene,
[Zustand](https://github.com/pmndrs/zustand) for state. Icons from
[Lucide](https://lucide.dev); sounds are synthesized on the fly with the Web
Audio API (no audio asset files).

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # oxlint
```

## Deployment

Pushing to `master` builds the app and publishes it to GitHub Pages via
`.github/workflows/deploy.yml`. The Vite `base` in `vite.config.ts` is set to
`/voxcel-3d/` to match this repo's Pages URL — update it if you fork this
under a different repo name.

---

Created by [Andrei Pabiarzhyn](https://github.com/AndreiPabiarzhyn).

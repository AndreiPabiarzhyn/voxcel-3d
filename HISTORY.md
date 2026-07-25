# Voxcel 3D — history & context

This file exists so a fresh agent (or a fresh session of Andrei) can pick up
this project cold, without re-reading the whole chat. Append new dated
entries as the project evolves — don't rewrite old ones, this is a log.

## What this project is

A voxel 3D editor for kids aged **6–10**: build 3D models out of cubes.
Framed as the natural next tool after Minecraft-skin and pixel-art work the
kids already do (Andrei previously built a Piskel-style pixel art editor —
see "Portfolio context" below).

It has to be a real learning app, not a bare canvas demo:
- polished, kid-friendly UI/UX (big icon-first controls, sound feedback,
  forgiving errors, minimal reading required — many users are barely
  reading fluently yet)
- small optional **challenges** ("build a house", "build an animal") with a
  reference image and a free sandbox mode alongside them
- the ability to **save your own project** and come back to it

## Portfolio context

This project is one of several kid/education-facing creative tools Andrei
(Kodland International Online School) has shipped, all in sibling folders
under `My Jobs/My Projects/`:

- **Lumitra** — full browser drawing studio: React, TypeScript, PixiJS,
  Zustand, Vite. Local-first, `.lumitra` project format.
- **Pixel Motion** (`clone-piskel`) — dependency-free pixel art/animation
  editor, vanilla JS + Canvas API, `.pxm` format, GIF/PNG export.
- **Aura//Lab** — Three.js 3D configurator (Roblox-style character/aura
  builder), vanilla JS modules, LocalStorage saves.
- **Rabbit Run — Blockly** — 10-level visual programming learning game,
  scaffolded difficulty, toolbox grows only when a new concept is needed.

The recurring pattern: **local-first** (no backend/accounts), **static
hosting** (GitHub Pages/Vercel), an app-specific project file format with
autosave/recovery, and — for the educational ones — carefully scaffolded
difficulty with immediate visual feedback. Voxcel 3D follows this pattern.

## Key decisions (2026-07-25)

Made explicitly with Andrei before scaffolding:

1. **Stack: React + Three.js**, via `@react-three/fiber` + `@react-three/drei`
   (not vanilla JS like Aura//Lab) — closer to the Lumitra pattern, chosen
   because the app needs a fair amount of surrounding UI state (toolbar,
   palette, challenge panel, project gallery), which React/Zustand handles
   better than hand-rolled DOM state. R3F + drei remove most of the
   boilerplate around raycasting onto a voxel grid and camera controls.
2. **Storage: local-only, no backend.** localStorage + an exportable/
   importable project file, same as every other tool in the portfolio.
   No accounts, so progress does not follow a kid across devices — accepted
   tradeoff for staying static-hostable and simple.
3. Language: `lang="ru"`, Russian copy in `index.html`/manifest — matches
   the conversation this project started from. Revisit if the target
   audience turns out to be multi-locale like Pixel Motion was.

## MVP feature scope (agreed direction, not all built yet)

1. **Scene** — voxel grid (default 8×8×8, easy to resize), orbit camera
   with clamped angle/zoom (kids shouldn't be able to flip the view upside
   down), soft shadows.
2. **Tools** — place cube, remove cube, paint cube, eyedropper, undo/redo.
3. **Palette** — bright color set + "recently used."
4. **Project** — own JSON format (`.voxcel`), autosave to localStorage,
   "My builds" gallery with a thumbnail per project.
5. **Challenges** — 5–6 starter challenge cards with a target-image and a
   list of unlocked tools; a no-limits sandbox mode alongside them.
6. **Export** — PNG screenshot, maybe a turntable GIF (Pixel Motion already
   has GIF-encoding code that could be reused/adapted).

## Progress log

### 2026-07-25 — initial scaffold
- `npm create vite@latest . -- --template react-ts`, then installed
  `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`.
- Stripped the Vite/React boilerplate (marketing landing page CSS, demo
  assets, counter button) down to a blank full-viewport canvas shell.
- Folder structure established:
  - `src/scene/` — R3F components: `Scene`, `Lighting`, `CameraRig`,
    `GroundGrid`, `Voxel`, `VoxelGrid`.
  - `src/store/projectStore.ts` — Zustand store holding voxel data
    (`Record<VoxelKey, VoxelData>`), selected color, add/remove actions.
    Seeded with 3 demo voxels so the render pipeline is provably working.
  - `src/lib/voxel/key.ts` — `"x,y,z"` string key helpers shared by the
    store and the renderer.
  - `src/types/project.ts` — `VoxelProject`/`VoxelData`/`VoxelKey` types;
    `VoxelProject` already shaped for the future `.voxcel` save format
    (id, name, gridSize, voxels, createdAt/updatedAt) even though nothing
    serializes it yet.
  - `src/features/` (editor/challenges/gallery) intentionally **not**
    created yet — deferred until those parts are actually built, to avoid
    empty placeholder dirs.
- Favicon/icons: `public/favicon.svg` is a hand-drawn isometric cube using
  the app's three seed colors (green/red/blue) on the app background
  color, doubling as the app's visual identity. `scripts/generate-icons.mjs`
  (uses `sharp`, run via `npm run icons`) rasterizes it to
  `icon-192.png`/`icon-512.png`/`apple-touch-icon.png`. `public/manifest.json`
  added (installable, landscape-oriented). `index.html` updated: `lang="ru"`,
  title, description meta, theme-color, manifest link, apple-touch-icon
  link.
- Verified: `npm run build` (tsc -b && vite build) passes clean; dev server
  boots and serves 200 on a smoke-test port.
- Not done yet, next up: toolbar/palette UI, actual place/remove/paint
  interaction (raycasting clicks onto the grid — currently the store has
  the actions but nothing calls them from the scene), save/load +
  localStorage autosave, challenge system, gallery view.
- Git: repo not yet initialized as of writing this entry (see next step in
  the same session).
- `git init` done. Not committed yet — Andrei hasn't asked for a commit,
  and the house rule here is to only commit when explicitly requested.

### 2026-07-25 — right-click pan, bigger default grid
- `DEFAULT_GRID_SIZE` in `projectStore.ts` bumped from 8 to 12.
- `CameraRig.tsx`: drei's built-in `OrbitControls` pan (`enablePan`) is
  left **off** — full pan drifts vertically too and can push the model
  off-screen with no way back, which is a bad failure mode for a 6-10
  y/o. Instead added a custom right-mouse-drag handler (raw
  pointerdown/move/up/cancel listeners on `gl.domElement`) that pans
  strictly left/right: it takes only the horizontal mouse delta, moves
  camera + target along the camera's local right vector (screen-space
  pan scale copied from OrbitControls' own math so it feels 1:1 at any
  zoom), and clamps the drift to `PAN_RANGE = 10` world units from
  wherever the drag started so a kid can't pan the build away entirely.
  `contextmenu` is preventDefault'd on the canvas so right-click doesn't
  pop the browser menu.
- Verified `npm run build` still passes after both changes.

### 2026-07-25 — click-to-build interaction + toolbar/palette HUD
- Store (`projectStore.ts`): added `tool: 'place' | 'paint' | 'erase'` +
  `setTool`, `paintVoxel`, and bounds-checking in `addVoxel` (silently
  no-ops outside `[0, gridSize)` on every axis — no floating cubes, no
  placing below the floor).
- `Voxel.tsx` now takes `x`/`y`/`z` instead of a position tuple and
  handles its own click: erase tool removes it, paint tool recolors it,
  place tool adds a new cube adjacent to whichever face was clicked
  (using the click's face normal — safe to use directly since voxels are
  never rotated, local normal = world normal).
- `GroundPlane.tsx` — new invisible click-catcher covering the floor, so
  "place" also works by clicking empty ground, not only existing cube
  faces (Three.js raycasts invisible meshes fine, so `visible={false}`
  costs nothing).
- `useClickWithoutDrag.ts` — small hook every clickable mesh uses:
  OrbitControls' left-button rotate-drag and a voxel click share the same
  button, so without a movement threshold, releasing a camera drag over a
  cube would also place/erase/paint it. Compares pointerdown/pointerup
  screen position; only fires the click if movement stayed under 6px.
- New `src/features/editor/` — `Toolbar.tsx` (place/paint/erase, emoji
  icons for now, no text needed), `Palette.tsx` (12-color swatch grid,
  `paletteColors.ts` holds the list), `EditorHud.tsx` combining both into
  one floating bottom-center panel over the canvas. Mounted in `App.tsx`.
- **Gotcha hit:** `palette.ts` (data) and `Palette.tsx` (component)
  collided on Windows' case-insensitive filesystem (TS error TS1261).
  Renamed the data file to `paletteColors.ts` — worth remembering before
  naming a data module after its matching component.
- Verified `npm run build` passes; did not visually confirm the click
  interactions in a real browser (no headless-browser tool available in
  this environment) — Andrei should manually check that place/paint/erase
  and the ground-click all behave before relying on this being done.
- Next up, still: save/load (localStorage autosave + `.voxcel` export),
  then challenges + gallery.

### 2026-07-25 — right-click pan now also up/down
- `CameraRig.tsx`: extended the custom right-drag handler to track
  `deltaY` alongside `deltaX` and offset the camera/target along the
  camera's local up vector too (same screen-space pan-scale formula as
  before, matching OrbitControls' own panLeft/panUp signs — drag right
  moves the view left, drag down moves the view up, standard "grab the
  world" feel).
- The drift clamp (`PAN_RANGE = 10`) now measures full 3D distance from
  where the drag started instead of just XZ, so it still catches
  vertical drift too.

### 2026-07-25 — undo/redo, localStorage autosave, .voxcel export/import
- `projectStore.ts`: added `projectId`/`projectName`/`createdAt` (a
  project now has an identity, not just a voxel map), and `past`/`future`
  history stacks (capped at `MAX_HISTORY = 50`). `addVoxel`/`removeVoxel`/
  `paintVoxel` push the pre-change `voxels` map onto `past` and clear
  `future` — but only when the action actually changes something (no-op
  bounds check, erasing an empty cell, painting the color it already is
  all skip the history push, so undo doesn't fill up with junk steps).
  `undo`/`redo` pop/push between `past`/`voxels`/`future`.
- `toProject()`/`loadProject()` added to the store — the
  serialize/deserialize boundary between store state and the
  `VoxelProject` shape (`types/project.ts`), used by both autosave and
  the file menu below.
- `src/lib/storage/localProject.ts` — thin localStorage read/write for a
  single autosave slot (`voxcel:autosave` key), wrapped in try/catch
  (private-mode/quota errors shouldn't crash the app). The store now
  reads this **synchronously at module init** to seed its initial state
  (falls back to the 3-cube seed demo if nothing saved) — deliberately
  not done in a `useEffect`, so there's no first-frame flash of the demo
  cubes before the real saved build pops in.
- `src/lib/storage/autosave.ts` — `startAutosave()` subscribes to the
  store and debounce-saves (800ms) whenever `voxels`/`gridSize`/
  `projectName` change. Called once at the top of `main.tsx`, outside
  React — it's a page-lifetime singleton, no cleanup needed.
- `src/features/editor/FileMenu.tsx` — top-right pill with two buttons:
  💾 export (serializes via `toProject()`, downloads as
  `<name>.voxcel` — plain JSON under the hood) and 📂 import (hidden
  file input, parses JSON, shape-checks it before calling `loadProject`,
  `window.alert`s a kid-readable message if the file doesn't look like a
  project). Loading a file resets `past`/`future` — you can't undo past
  an import.
- `Toolbar.tsx` gained ↩️/↪️ undo/redo buttons, disabled (and visibly
  dimmed) when their stack is empty. `useHistoryShortcuts.ts` adds
  Ctrl/Cmd+Z and Ctrl/Cmd+Y (or Shift+Z) globally.
- Verified `npm run build` passes; restarted the dev server clean rather
  than trusting HMR, since `main.tsx` now runs a top-level side effect
  (`startAutosave()`) that dev-server hot-reload doesn't reliably re-run
  in isolation.
- Not verified by eye (still no headless-browser tool in this
  environment): that autosave actually survives a real page refresh,
  that exported `.voxcel` files re-import cleanly, and that undo/redo
  feels right across all three tools. Worth Andrei double-checking those
  three specifically before trusting this layer.
- Next up: challenges (target-image cards, tool unlocking) and a "Мои
  постройки" gallery — the gallery will need multiple saved slots, not
  just the single autosave slot this pass added.

### 2026-07-25 — real icons, responsive HUD fix, true top-down camera, .glb model export
Andrei sent a screenshot showing the bottom HUD ballooning to half the
screen height when the window is narrowed, and asked for four things:
real icons instead of emoji, a fix for that HUD bug, a "straight down"
camera option (previously capped at 30° off vertical, still felt
angled), and a proper 3D-model save format usable outside the editor
(e.g. in a game engine), not just the editor's own `.voxcel`.

- **Icons.** New `src/features/editor/icons.tsx` — hand-written inline
  SVGs (24×24 viewBox, `stroke="currentColor"`, no external icon
  library) replacing every emoji: `PlaceIcon` (isometric cube, matches
  the favicon motif), `PaintIcon` (paint drip), `EraseIcon` (angled
  eraser), `UndoIcon`/`RedoIcon` (circular arrow with a hook tail —
  mirror images of each other), `DownloadIcon`/`FolderIcon` (save/open a
  file), `ExportModelIcon` (small block + down arrow), `HomeIcon` (reset
  view), `FrontViewIcon` (flat square), `TopViewIcon` (square with a 3×3
  grid — reads as "looking straight down at the floor"). `Toolbar.tsx`
  and `FileMenu.tsx` now render these instead of emoji spans; button CSS
  gained an explicit `color` so `currentColor` has something to pick up
  (emoji ignored text color entirely, being pre-colored glyphs).
- **HUD overflow bug, root cause.** `.editor-hud` was a `flex` row with
  no wrap/shrink strategy. Narrowing the window squeezed the flex row;
  `Toolbar` (no wrap) held its size, so all the squeeze landed on
  `Palette`, whose `flex-wrap: wrap` let it collapse down to 2 columns ×
  6 rows — technically "fitting" the width but exploding the height,
  which is what read as "half the screen". **Fix:** removed wrapping
  from `Palette` entirely (`flex-wrap: nowrap`, swatches
  `flex-shrink: 0`), same `flex-shrink: 0` on `Toolbar` and its buttons,
  and moved the overflow handling to the outer `.editor-hud` /
  `.file-menu` / `.view-presets` containers instead (`overflow-x: auto`
  + thin scrollbar styling). Net effect: the HUD's height is now
  constant regardless of window width — if it doesn't fit, the whole
  strip scrolls horizontally as one unit rather than any element
  wrapping into a tall grid.
- **True top-down camera.** `minPolarAngle` was `Math.PI / 6` (30°),
  chosen originally just to avoid disorientation — but it also meant
  "top view" was never actually reachable, which is what Andrei was
  hitting. Dropped it to `TOP_POLAR_ANGLE = 0.05` rad (~3°) — as close to
  a true pole as `camera.lookAt()` tolerates before its basis-vector math
  degenerates (right/up vectors go to zero length exactly at the pole,
  since the view direction lines up with the up vector). At 3° off
  vertical the tilt is visually imperceptible, so this reads as a real
  top-down view. Also added `src/scene/cameraController.ts` — a small
  module-level (non-React) registry that `CameraRig` fills with the
  live `camera`/`controls` refs plus a captured `homePosition`/
  `homeTarget` snapshot at mount, and `setViewPreset('home' | 'front' |
  'top')` to jump the camera there from anywhere, including from plain
  HTML buttons outside the R3F tree (which can't call `useThree()`
  directly). New `ViewPresets.tsx` — top-left button cluster (mirrors
  `FileMenu`'s top-right position) using `HomeIcon`/`FrontViewIcon`/
  `TopViewIcon`. `home` restores the exact camera pose the app started
  with (not a recomputed angle); `front`/`top` compute a new position
  via spherical coordinates around the current target, preserving
  whatever zoom distance was already dialed in.
- **`.glb` 3D model export — the actual design decision here.**
  `.voxcel` (the existing save format) is a sparse voxel map —
  perfect for re-editing, useless to a game engine or 3D app, which
  wants a real mesh. Rather than inventing a custom mesh format, used
  the industry-standard one: `src/lib/voxel/exportModel.ts` builds a
  plain `THREE.Group` (one box mesh per voxel, geometry shared across
  all of them, one `MeshStandardMaterial` cached per distinct color so
  repeated colors don't duplicate materials) and runs it through
  three.js's own `GLTFExporter` (bundled in `three-stdlib`, already a
  dependency via drei) with `{ binary: true }` to produce a single
  `.glb` file. glTF/.glb is what Unity, Unreal, Godot, Blender,
  Three.js/Babylon.js scenes, and most game-asset pipelines import
  natively — "drop it into a 3D game" becomes a real, working path, not
  aspirational. `.voxcel` stays the project format (editable, reopens in
  Voxcel 3D); `.glb` is a one-way export for use elsewhere. Wired into
  `FileMenu.tsx` as a third button (`ExportModelIcon`), separated from
  the project save/open pair by a divider, disabled while exporting.
  Not done: greedy meshing / merged geometry to cut face count for
  larger builds — irrelevant at the current 12³ grid size (at most 1728
  boxes, trivial for any modern GPU/importer), worth revisiting only if
  grid sizes grow substantially.
- Verified `npm run build` passes (bundle grew ~35KB gzip from
  `GLTFExporter` — expected, acceptable). Restarted the dev server
  clean and reopened the browser. Did **not** verify by eye — still no
  headless-browser tool in this environment — that the HUD actually
  stays compact at narrow widths, that the top-down view looks right,
  or that an exported `.glb` opens cleanly in an external tool (e.g.
  Blender or a three.js `GLTFLoader` scene). Andrei should check those
  three specifically.

### 2026-07-25 — place/paint/erase animations, creator credit
- New `src/scene/voxelAnimation.ts` — shared constants
  (`PLACE_DURATION_MS`, `PAINT_PULSE_DURATION_MS`, `ERASE_DURATION_MS`)
  and an `easeOutBack` helper (the standard overshoot-then-settle easing
  curve) so `Voxel.tsx` isn't hand-rolling animation math inline.
- `Voxel.tsx` now drives its own mesh scale imperatively every frame via
  `useFrame`, instead of a static scale:
  - **Place:** every fresh mount starts at `scale=0.001` (set as the JSX
    default so there's no one-frame flash at full size) and eases up to
    1 over 220ms via `easeOutBack`, which overshoots slightly past 1
    before settling — a small "pop" rather than a flat fade-in. Since
    voxels loaded from a saved project also mount fresh, reopening a
    build plays the same pop-in for every cube — treated as an
    intentional, charming "assembling" effect rather than a bug worth
    suppressing.
  - **Paint:** the color prop changing (without a remount, since the key
    is unchanged) is caught in a `useEffect` comparing against a
    `prevColor` ref, which starts a 220ms sine-shaped scale pulse
    (up to +18% size at the midpoint, back to 1) — a light "boop", not a
    full re-pop. A paint click that doesn't actually change color (same
    color reselected) never touches `prevColor`, so it correctly doesn't
    pulse, consistent with the store already no-op'ing that case.
  - **Erase:** clicking with the erase tool no longer calls
    `removeVoxel` directly — it stamps `eraseAt` with the current time,
    the mesh shrinks 1→0 over 160ms, and only once that finishes does it
    call `removeVoxel` (guarded by an `erasedOnce` ref so it can only
    fire once). This is what makes the shrink visible at all: the old
    code deleted the voxel from the store immediately, which unmounts
    the mesh on the very next React commit, before any animation could
    render. Undoing an erase re-mounts a fresh `Voxel`, so it naturally
    plays the pop-in again rather than a "reverse shrink" — not treated
    as worth special-casing.
  - Every path clamps the final scale to a `0.001` floor — an exact 0
    scale can zero out the mesh's normal matrix and flash NaN lighting
    for a frame.
- **Creator credit:** `src/features/editor/Credit.tsx` — small, low-
  opacity, `pointer-events: none` text pinned bottom-left ("Voxcel 3D ·
  created by Andrei Pabiarzhyn"), deliberately not a link (no URL was
  given to point it at). Also added `<meta name="author" content="Andrei
  Pabiarzhyn">` to `index.html` — invisible in-page but standard
  practice and free to add.
- Verified `npm run build` passes; restarted the dev server and
  reopened the browser. Did not verify by eye that the three animations
  actually look right (timing/easing choices were reasoned from the
  math, not tuned against a real render) — worth Andrei eyeballing
  whether 220ms/160ms feel right or want adjusting, that's a taste call
  no amount of code review substitutes for.
- Andrei also asked what else is worth doing for hygiene/UX/icons.
  Answered in-conversation (not yet built, no code changed for these):
  sound effects on place/paint/erase/undo (part of the original brief,
  still missing), replacing `window.alert` on bad file import with an
  in-app toast (an OS alert box reads jarring for this audience), a
  first-visit hint bubble for camera controls, consolidating the
  near-duplicate Toolbar/FileMenu/ViewPresets panel CSS into one shared
  base class, custom `:focus-visible` styling on all the HUD buttons
  (currently relying on the browser default, which will look wrong
  against the dark rounded buttons), and highlighting whichever
  ViewPresets button matches the current camera angle (currently none
  show as "active").

### 2026-07-25 — real icon library, sound effects, toast, focus states
Andrei pushed back hard on the hand-drawn icons ("шакальные... нихера
нормально не понятно" — not clear at all) and asked for a real design
pass: study actual icon conventions, and make sure kids immediately
understand what each button does. Also asked to continue the backlog
from the previous entry.

- **Icons — swapped hand-drawn SVGs for Lucide.** Rather than keep
  iterating on bespoke path data by hand (the actual root cause of the
  complaint — hand-drawn shapes without a design tool or real user
  testing are a gamble), pulled in `lucide-react` (ISC-licensed, the
  same "24×24, stroke-based, currentColor" style already established)
  and verified the exact path data for every candidate icon by reading
  the installed package's source files directly
  (`node_modules/lucide-react/dist/esm/icons/*.mjs`) rather than
  guessing names — e.g. confirmed `Blocks` renders as two visibly joined
  cubes (not a single ambiguous cube), `Eraser` is a real chamfered
  eraser silhouette, `PaintBucket` is the tilting-bucket-with-drip glyph
  every kid has already seen in MS Paint/Paint 3D/Scratch. Mapping
  (`src/features/editor/icons.tsx`, now a thin re-export, not hand-drawn
  paths): `Blocks`→place, `PaintBucket`→paint, `Eraser`→erase,
  `Undo2`/`Redo2`→undo/redo, `Download`→save project, `FolderOpen`→open
  project, `Box`→export 3D model, `House`→reset view, `Eye`→front view,
  `Grid3x3`→top view. Re-exported under this app's semantic names
  (`PlaceIcon`, not `Blocks`) so call sites document intent, not the
  underlying glyph library.
  - Wrapped the app in `<LucideProvider strokeWidth={2.25}>`
    (`main.tsx`) — bolder than Lucide's default 2px stroke, deliberately,
    so the shapes read faster at a glance for young kids without having
    to set `strokeWidth` at every call site.
  - Updated every call site (`Toolbar.tsx`, `FileMenu.tsx`,
    `ViewPresets.tsx`) from the old `width={n} height={n}` pair to
    Lucide's own `size={n}` prop.
  - Bundle impact was negligible (~2KB gzip) — Lucide tree-shakes well,
    only the icons actually imported end up in the build.
- **Sound effects** — `src/lib/audio/sounds.ts`, synthesized tones via
  the Web Audio API (`OscillatorNode` + a linear-attack/exponential-
  decay `GainNode` envelope) rather than sourcing/licensing audio
  files: a bright two-note "pop" for place, a soft chime for paint, a
  falling two-note "poof" for erase, and a low/high click pair for
  undo/redo. Deliberately triggered from the **click handlers**
  (`Voxel.tsx`, `GroundPlane.tsx`) rather than from mount/prop-change
  effects — the animations (previous entry) intentionally replay on
  page load and on undo/redo, but sound must not, or reopening a
  50-cube build would fire 50 pop sounds at once. `AudioContext` is
  created lazily on first use and resumed inside a click handler, which
  satisfies every browser's autoplay-requires-a-user-gesture policy
  without a separate "unlock audio" step.
  - New `src/store/historyActions.ts` — `undoWithSound`/`redoWithSound`
    wrap the store's `undo`/`redo` with the click sound and, importantly,
    skip the sound entirely when the stack is empty (matches the
    buttons already being disabled then). Both the Toolbar buttons and
    `useHistoryShortcuts` (Ctrl+Z/Ctrl+Y) now go through these wrappers
    instead of calling the store directly, so keyboard and mouse stay
    in sync rather than duplicating the pairing logic twice.
- **Toast instead of `window.alert`** — `src/lib/toast/toastStore.ts`
  (a small Zustand store: `show(text, tone)`/`dismiss(id)`, auto-dismiss
  after 3.2s) and `ToastHost.tsx`, mounted once in `App.tsx`, rendering
  top-center (the one HUD corner still free — top-left is ViewPresets,
  top-right is FileMenu, bottom-center is the main HUD). `FileMenu.tsx`
  now shows a success toast after exporting/importing a project or
  model, and an error-toned toast (not an OS alert box) when an
  imported file doesn't parse as a project.
- **Focus states** — added `:focus-visible` outlines to every HUD
  button (`Toolbar`, `FileMenu`, `ViewPresets`, `Palette` swatches) —
  previously relied on the browser default ring, which reads oddly
  against dark rounded buttons and wasn't consistent across them.
- Verified `npm run build` passes. Restarted the dev server and
  reopened the browser. Did not verify by eye or ear — still no
  headless-browser tool here — whether the new icons actually read as
  clearer to look at, whether the synthesized sounds sound pleasant
  rather than jarring, or whether toast timing/placement feels right.
  These are exactly the kind of taste calls that need a real person
  looking at (and listening to) the running app — Andrei should check
  all three before considering this "done."
- Still not done, carried over from last entry: consolidating the
  Toolbar/FileMenu/ViewPresets panel CSS into one shared base class (the
  duplication is now four files, not three, with `ToastHost` added), a
  first-visit hint for camera controls, and highlighting the active
  ViewPresets button. Also not done: challenges (target-image cards,
  tool unlocking) and the "Мои постройки" multi-slot gallery — both
  bigger features intentionally deferred rather than folded into an
  already-large polish pass.

### 2026-07-25 — performance pass (stutter fix) + softer sounds
Andrei reported the app "подтормаживает" (a bit choppy/stuttery) and
asked the sounds be gentler. Rather than guess at the stutter, reasoned
through the actual mechanics of what gets more expensive as a build
grows, since that's the detail that would tell whether this is a real
bug or just perception:

- **Root cause (most likely): R3F's automatic hover raycasting scales
  with voxel count.** React Three Fiber raycasts every interactive mesh
  on every native `pointermove` event to track hover state — that's
  normal and cheap for a handful of objects, but linear in the number of
  meshes. With every `Voxel` carrying its own click handlers, a build of
  a few hundred cubes means a few hundred raycast tests on every mouse
  movement over the canvas, not just on click — this is a known,
  documented scaling issue in the R3F ecosystem once object counts climb
  into the hundreds+.
  - **Fix:** wrapped `VoxelGrid` + `GroundPlane` in drei's `<Bvh
    firstHitOnly>` (`Scene.tsx`) — indexes the group once into a
    bounding-volume hierarchy so raycasting becomes a fast tree lookup
    instead of a full linear scan. `three-mesh-bvh` (the package `Bvh`
    is built on) was already present as a transitive dependency, so this
    added no new package, just ~14KB gzip to the bundle from actually
    importing it. `GroundGrid` (the visual floor helper, never
    clickable) stays outside the `Bvh` — no reason to index something
    that's never raycast against.
- **Second contributor: redundant per-frame and per-render work scaling
  with voxel count.** Two more things get proportionally more expensive
  as a build grows, independent of raycasting:
  - Every `Voxel` registered a `useFrame` callback that ran its full
    animation-math branch on **every frame**, even long after it had
    finished popping in and had nothing left to animate. Added a
    `settled` ref — once a voxel's scale reaches 1 with no pulse/erase
    in flight, the callback becomes a single boolean check and returns
    immediately. Reset to `false` whenever a paint pulse or an erase
    starts, so those still animate correctly.
  - `Voxel` wasn't memoized, so `VoxelGrid` re-rendering (which happens
    on literally every add/paint/remove, since `voxels` is a new object
    reference each time) re-invoked every unrelated voxel's component
    function too. Wrapped it in `React.memo` — props are plain
    x/y/z/color primitives, so shallow-equal memoization is exactly
    correct here, no custom comparator needed.
  - Every voxel was also instantiating its **own** `BoxGeometry` and
    `MeshStandardMaterial` (via JSX `<boxGeometry>`/`<meshStandardMaterial>`
    children), even though every voxel is an identical unit cube and
    many share the exact same color. Replaced with a single
    module-level shared `BoxGeometry` and a `Map<color, Material>`
    cache (same pattern already used in `exportModel.ts`), passed via
    the `geometry`/`material` mesh props instead of JSX children. Beyond
    the memory/GPU-upload saving, this cuts down on garbage-collection
    churn from constantly allocating-then-discarding these objects
    during an active building session — GC pauses are a classic, easy to
    miss source of exactly the kind of stutter being described here.
    Note for later: nothing here mutates a shared material's own
    properties (paint's pulse animates `mesh.scale`, not the material) —
    a future effect that wants a material-level flash instead would need
    its own material instance, not this cache.
- **Softer sounds** — `sounds.ts` rewritten: every tone is now a plain
  sine wave (previously place used triangle, erase used sawtooth, undo/
  redo used square — sawtooth and square are the harmonically harshest
  waveforms, sawtooth especially at erase's low pitch was almost
  certainly the least "soft" sound in the set), attack lengthened from
  10ms to 20ms so notes swell in rather than click on, added a lowpass
  filter (2200Hz cutoff) on every tone to round off any remaining edge,
  and lowered gain across the board (max 0.11, down from 0.18).
- Verified `npm run build` passes; restarted the dev server and
  reopened the browser. **Could not verify the actual fix** — there's no
  way to profile real frame timing or judge "does this feel smoother
  now" without a live browser and a real interaction session, and no
  headless-browser tool is available here. The three changes above are
  the mechanically correct fixes for the specific inefficiencies that
  exist in the code (verified by reading how R3F's event system and
  Three.js resource allocation actually work), not a guess, but Andrei
  should build up a reasonably large structure and confirm it actually
  feels smoother — and separately confirm the sounds now read as gentle
  rather than harsh, since that's a pure taste call.
- If it's still choppy after this, the next things worth checking:
  whether it's specifically the camera drag that's janky (would point at
  something in `CameraRig`'s pointer handling rather than the voxels),
  whether it only shows up past a certain voxel count (would confirm
  the raycasting/GC theory and suggest going further — e.g. merging
  voxel geometry into chunks instead of one mesh per cube), or whether
  it's present even on an empty grid (would point somewhere else
  entirely, like the shadow map or the `Grid` helper's shader).

### 2026-07-25 — PNG screenshot, touch pan, friendly color names
Andrei's message got garbled by a keyboard-layout mismatch (Cyrillic
typed while the OS had a Latin layout active — decoded to "Супер, что
ещё можно сделать или уже всё?"). Asked which of the previously-listed
gaps to close; picked "quick fixes first": PNG export, touch-tablet
panning, and human-readable color names — all three were things
already missing against the original plan, not new scope.

- **PNG screenshot.** New `src/scene/screenshotController.ts` — same
  module-registry pattern as `cameraController.ts` (a plain module-level
  variable holding the live `HTMLCanvasElement`, filled in by
  `CameraRig`'s existing effect since it already has `gl` from
  `useThree()`, read from `FileMenu`'s plain HTML button outside the R3F
  tree). `captureScreenshot(name)` calls the canvas's own
  `.toBlob('image/png')` and downloads it. Had to add
  `gl={{ preserveDrawingBuffer: true }}` to the `<Canvas>` in
  `Scene.tsx` — without it, a WebGL context is free to clear its
  drawing buffer immediately after presenting a frame, and reading it
  back via `toBlob` right after can come back blank. New `Camera`→
  `ScreenshotIcon` in `icons.tsx`, wired as a third button group in
  `FileMenu.tsx`.
- **Touch panning on tablets.** The right-click pan built earlier only
  ever fires for `event.button === 2` — meaningless on touch, which has
  no right-click. Rather than hand-roll two-finger-drag detection
  ourselves (real risk of it fighting OrbitControls' own internal
  multi-touch state machine, and there's no way to test actual touch
  input in this environment to catch bugs in that), leaned on
  OrbitControls' own well-tested two-finger pan+pinch handling instead:
  flipped `enablePan` back to `true`, but set `mouseButtons={{ LEFT:
  ROTATE, MIDDLE: DOLLY }}` with **no RIGHT entry** — confirmed by
  reading `three-stdlib`'s source that an unmapped mouse button falls
  through to a no-op, so the right mouse button stays entirely under our
  custom handler, untouched by this change. `enablePan: true` only ends
  up affecting the touch path (`touches={{ ONE: ROTATE, TWO:
  DOLLY_PAN }}`, matching OrbitControls' own default, made explicit).
  Tradeoff: touch pan doesn't get our `PAN_RANGE` drift clamp the way
  mouse pan does — accepted because the Home button (added a couple of
  entries back) is now a one-tap recovery if a tablet user pans too far,
  which is what the clamp was originally protecting against.
- **Friendly color names.** `paletteColors.ts` was a flat array of hex
  strings; palette tooltips showed the raw hex code
  (`aria-label="Цвет #ff5c5c"`), unreadable for the target age group.
  Changed `PALETTE_COLORS` to `{ hex, name }` objects with plain Russian
  names (Красный, Оранжевый, ... Чёрный for the near-black `#2b2f3a`
  swatch — technically a dark charcoal, but a kid would call it black,
  and "black" is the more useful label than "dark grey"). `Palette.tsx`
  updated to match; nothing else imported the old flat-array shape.
- Verified `npm run build` passes; restarted the dev server and
  reopened the browser. Did not verify by eye: whether the screenshot
  actually captures the current view correctly (needs a real click +
  checking the downloaded file), and — the one that matters most here —
  **could not test touch/two-finger-pan at all**, since there's no
  touchscreen or touch-emulation tool available in this environment.
  This is the least-verified change in the project so far; Andrei should
  specifically test on an actual tablet or with Chrome DevTools' touch
  emulation before trusting it works.

### 2026-07-25 — challenges (the last big piece from the original brief)
The one major thing missing since the very first conversation: this app
was supposed to be a learning app with small optional challenges, not
just a sandbox. Before building, asked Andrei how to show a challenge's
target — a flat reference image (classic, simpler) vs a translucent
"ghost" of the target shape rendered directly in the build grid, which
fades cube-by-cube as the real thing gets built. He picked the ghost.
That choice drove the whole design below — it's genuinely a better fit
for a voxel editor than an image ever could be, because the "picture"
is just more voxel data in the exact same coordinate space as what's
being built, so comparing target-vs-built is trivial instead of
image-analysis-hard.

- **Challenge data** (`features/challenges/challengeData.ts`) — a
  `Challenge` is just `{ id, title, hint, emoji, target }` where `target`
  is a `Record<VoxelKey, VoxelData>` — the exact same shape as the main
  project's `voxels`, which is precisely what makes comparison cheap.
  Three starter shapes, generated programmatically (a `square()` helper
  stamping concentric flat layers) rather than hand-listed cube-by-cube,
  to keep the coordinates correct and the file easy to extend: **Домик**
  (3×3 hollow-free walls + roof slab, ~27 cubes), **Ёлочка** (tapering
  5×5→3×3→1×1 foliage over a trunk, ~36 cubes), **Гриб** (wide 5×5→3×3
  cap over a stem, ~36 cubes). All colors pulled from the existing
  `PALETTE_COLORS` set on purpose, so a kid can always find a matching
  swatch. Shapes sit at a fixed offset inside the default 12×12 grid —
  comfortably clear of both the grid edges and the 3 seed demo cubes.
- **Progress = "does a cube exist here," full stop — not color-checked.**
  `challengeProgress.ts`'s `getChallengeProgress()` counts a target cell
  as filled the instant ANY voxel occupies it. Deliberately not
  color-exact: a wrong-colored real cube sitting exactly where a ghost
  would render is a same-position mesh overlap (z-fighting) to draw, and
  demanding color precision from a 6-10 y/o is needlessly strict. The
  ghost still shows the *intended* color, so color-matching remains part
  of the activity — it's just not gatekept.
- **The ghost itself** (`scene/ChallengeGhost.tsx`) — for the active
  challenge, renders one translucent box (`opacity: 0.25`, drei's
  `<Edges>` for a crisp outline in the target color) per target cell
  that isn't filled yet; filled cells simply don't get a ghost mesh, so
  there's never a real cube and a ghost occupying the same spot at once.
  `raycast={() => null}` on every ghost mesh makes them click-through by
  construction, no special-casing needed elsewhere — a click ray just
  continues past an unhandled mesh to whatever's actually behind it
  (the ground plane or a real voxel).
  - **Completion is automatic**, matching the chosen design: once every
    target cell is filled, an effect fires `completeChallenge(id)` (see
    below), a small rising four-note major-chord fanfare
    (`playChallengeCompleteSound`, same soft sine-wave style as the rest
    of `sounds.ts`), and a success toast. Guarded by
    `completedChallengeIds` so it only fires once per challenge, not
    every frame the grid happens to already be complete.
- **Challenge state** (`features/challenges/challengeStore.ts`) — a
  small dedicated Zustand store, deliberately separate from
  `projectStore`: `activeChallengeId` (which ghost is showing, if any),
  `completedChallengeIds` (persisted to its own localStorage key,
  `voxcel:completed-challenges` — this is progress/achievement data, not
  project data, so it doesn't belong in the `.voxcel` save format), and
  `panelOpen` for the browse UI.
- **Browse/start/exit UI** — `ChallengesButton.tsx` (a 🎯-icon button
  slotted into the main `EditorHud`, between the tool buttons and the
  palette, highlighted gold while a challenge is active) opens
  `ChallengePanel.tsx`: a centered modal listing all three challenges
  with an emoji, title, hint, a live `filled/total` counter for
  whichever one is active, a completed checkmark badge for ones already
  finished, and a "Свободный режим" button that clears
  `activeChallengeId` and goes back to unrestricted sandbox building —
  the free mode from the original plan was never meant to go away, just
  sit alongside challenges.
- New icons: `Target`→`ChallengesIcon`, `CheckCircle2`→`CompletedIcon`,
  `X`→`CloseIcon` (all Lucide, same reasoning as the earlier icon pass).
  Emoji reappear here on purpose, but only as card decoration (🏠🌲🍄) —
  different from the earlier complaint, which was about ambiguous
  *functional* icons; a big friendly emoji labeling "this challenge is
  about a house" isn't a control anyone has to parse correctly to use
  the app, it's closer to content than interface.
- Verified `npm run build` passes; restarted the dev server and
  reopened the browser. Did not verify by eye: whether the three shapes
  actually read as "a house / a tree / a mushroom" once rendered (they
  were authored as coordinate math, never seen rendered), whether the
  ghost's translucency/outline is actually legible against the floor
  grid and lighting, and whether finishing a challenge by filling every
  cell actually feels achievable and satisfying rather than tedious.
  These are exactly the kind of things that need eyes on the running
  app — Andrei should build each challenge once to confirm the shapes
  read correctly and the completion moment feels good.
- Not done: more than 3 challenges (easy to add more — just more
  `build*()` functions in `challengeData.ts`), any indication of
  challenge progress while the panel is closed (the ghost itself is the
  only in-scene feedback right now), and the panel doesn't show a
  live 3D thumbnail preview per card, just an emoji + text — considered
  and skipped for now (would mean a separate mini-Canvas per card,
  real added complexity/perf cost for a nice-but-not-essential touch).

### 2026-07-25 — design pass: "this looks like obvious vibe-coding"
Andrei interrupted mid-task with a screenshot of the challenge panel and
pushback that was hard to misread: flat generic dark cards, a plain
system font, no real visual hierarchy — read as AI-default rather than
designed. Paused the in-progress gallery feature to fix this first,
since building more UI on top of the same generic look would just be
more of the same problem.

- **Typeface.** Was `'Segoe UI', system-ui, sans-serif` — whatever the
  OS defaults to, no personality. Wanted something warmer/rounder
  without reaching for Comic-Sans-adjacent novelty. Landed on **Nunito**
  (a warm, rounded, high-legibility sans already common in modern
  consumer/education products) at weights 400-800 for both body and
  display use.
  - Initially reached for a Baloo-2 + Nunito display/body pairing —
    Baloo 2 is chunkier and more playful, seemed ideal for headings —
    but checking the actual font files turned up that Baloo 2 has no
    Cyrillic glyphs at all (it's an Indic-script family with Latin
    support bolted on, not built for Russian). Since this app's UI text
    is mostly Russian, a heading font that can't render Cyrillic would
    have silently fallen back to the system font on every single
    heading — worse than not trying. Dropped Baloo 2, used Nunito's own
    800 weight for headings instead. Caught by actually inspecting the
    downloaded font's language coverage rather than assuming a popular
    Google Font supports everything.
  - **Self-hosted, not a Google Fonts CDN link.** Fetched Google's own
    CSS2 endpoint once (`fonts.googleapis.com/css2?family=...`), found
    it resolves to a *variable* font — one file covers weights 400-900
    per script subset, not one file per weight — parsed out just the
    `latin` and `cyrillic` subset URLs (skipped latin-ext/vietnamese/
    devanagari/cyrillic-ext, not needed here), downloaded the 2 actual
    `.woff2` files into `public/fonts/`, and wrote local `@font-face`
    rules in `index.css` pointing at them. Reasoning: a Google Fonts CDN
    `<link>` sends every visitor's IP to Google on every page load
    purely to fetch a font file — a German court found this GDPR-
    non-compliant without consent in 2022, Andrei is EU-based, and the
    audience is children. Self-hosting costs nothing (2 files, ~60KB
    total) and matches the project's existing local-first ethos anyway.
- **Design tokens** — `index.css` gained a proper `:root` token set:
  `--surface`/`--surface-raised` (two-level elevation instead of one
  flat `rgba(255,255,255,0.08)` reused everywhere), `--text`/
  `--text-dim`, named accents (`--accent` cyan, `--gold`, `--leaf`,
  `--coral`), a radius scale, and two shadow tokens. Small thing, but it
  means a color/spacing decision now lives in one place instead of
  being re-guessed per component.
- **New `src/styles/hud.css`** — shared primitives every floating
  control now draws from, imported once in `main.tsx`:
  - `.hud-panel` / `.hud-divider` — the floating rounded translucent
    container look (was copy-pasted with tiny inconsistencies across
    `Toolbar.css`, `FileMenu.css`, `ViewPresets.css`).
  - `.hud-button` (+ `.hud-button--active-cyan` / `--active-gold`) — the
    48px icon-button treatment, unifying what used to be 52px in
    Toolbar and 44px in FileMenu/ViewPresets for no real reason.
  - `.btn-pill` / `.btn-pill--ghost` — a genuinely new pattern: a
    **pressable** button with a bottom-offset shadow (`box-shadow: 0 4px
    0 var(--accent-deep)`) that compresses on `:active` (`translateY(3px)`
    + shadow shrinks to `0 1px 0`). This "sticker button" look — common
    in Duolingo/Khan-Academy-Kids-style kid/game UI — is what
    the flat "Начать" button in the screenshot was missing: it now
    looks and feels physically pressable instead of just clickable.
  - `.chip` / `.chip--gold` / `.chip--success` — small pill labels, used
    for the challenge panel's "Готово" badge, reusable later (gallery
    "saved" indicators, etc.).
  - Every component (`Toolbar`, `FileMenu`, `ViewPresets`,
    `ChallengesButton`) had its bespoke button/panel CSS deleted down to
    just positioning (`position: fixed`, corner offsets, overflow
    handling) — this is also the CSS-duplication cleanup flagged as debt
    several entries back, done as a side effect of fixing the look, not
    a separate pass.
- **Challenge panel redesign** (the actual screenshot) —
  - Emoji now sits in a soft circular badge instead of floating loose
    next to the title, giving it visual weight as an icon rather than
    a stray character.
  - "Готово" moved from a bare tiny checkmark icon next to the title
    into a proper `chip--success` pill — reads as a badge, not a typo.
  - Progress (`8 / 27`) is now a small gold pill instead of plain text,
    matching the active-card's gold accent.
  - The action button (Начать/Играю/Ещё раз) uses the new `.btn-pill`
    pressable treatment; the "Свободный режим" exit uses
    `.btn-pill--ghost` (dashed outline, transparent) so it visually
    reads as the secondary/exit action, not competing with the primary
    per-card buttons.
  - Backdrop got a blur (`backdrop-filter: blur(3px)`) instead of a flat
    dim, matching the blur already used on the HUD panels.
- Verified `npm run build` passes and confirmed the font files land in
  `dist/fonts/` (Vite copies `public/` verbatim) and are served with a
  200 by the dev server. Restarted the dev server and reopened the
  browser. **Did not verify by eye** — the entire point of this pass was
  a visual/taste judgment call ("does this look designed now"), which is
  exactly the kind of thing that needs Andrei's own eyes on the running
  app, not my reasoning about CSS values. Please look at it and say
  what's still off.
- Gallery feature (the task in progress before this interruption) is
  still pending — resuming that next, now built on top of this new
  visual language from the start instead of needing a second pass.

## 2026-07-25 — follow-up: "still crippled" + real icons instead of emoji

Andrei's reply to the design pass above: screenshot showed the redesigned
challenge panel, verdict "Все еще калечно + сделай не эмлодзи а Цветной
картиной иконки" (still janky/crippled + make it not emoji but colorful
picture icons). Two separate problems to fix:

1. **Emoji itself was the bug, not just the styling around it.** Emoji
   glyphs render via the OS's own emoji font — on Windows that can look
   dated, mismatched in style/color palette from the rest of the UI, and
   inconsistent across machines. No amount of circle-badge styling around
   a character fixes that; the character itself needed to go.
2. Card layout had a real inconsistency: the "Готово" chip only appeared
   on completed cards, so completed vs. not-completed rows had different
   numbers of stacked elements in the right-hand column and didn't line
   up — a concrete contributor to "calечно" beyond just the emoji.

**Fix — colorful icon graphics, not text:**
- Downloaded three Twemoji SVGs (house 🏠 U+1F3E0, evergreen tree 🌲
  U+1F332, mushroom 🍄 U+1F344) from the twemoji project (CC-BY 4.0,
  self-contained flat-color vector art, no external refs) and saved them
  locally to `public/icons/challenges/{house,tree,mushroom}.svg` — same
  self-hosting principle as the fonts, not pulled from a CDN at runtime.
- `challengeData.ts`: replaced the `emoji: string` field with `icon:
  string` (path to the SVG) and a new `accent: 'gold' | 'leaf' | 'coral'`
  field per challenge, so each icon gets a tinted background that matches
  its actual illustration colors (house → warm gold tint, tree → green,
  mushroom → coral/red).
- `ChallengePanel.tsx` / `.css`: icon now renders as an `<img>` inside a
  rounded-square tinted badge (`.challenge-card__icon-badge`), sized to
  read clearly at a glance. Adopted the Duolingo/Khan-Academy-Kids
  "skill node" pattern for completion: instead of a separate chip
  competing for space in the right column, a small green checkmark badge
  now overlaps the bottom-right corner of the icon itself
  (`.challenge-card__done-badge`, ringed with the card's own background
  color to read as a cutout, not a sticker). This removes the
  chip-vs-no-chip layout inconsistency entirely — every row now has
  exactly one thing in the right column (the action button), vertically
  centered, so all three rows line up identically regardless of
  completion state.
- Verified `npm run build` passes, confirmed all three SVGs are served
  with 200 by the dev server at `/icons/challenges/*.svg`, and restarted
  dev server cleanly (found and killed a stale native Windows node.exe
  still holding port 5173 from an earlier session via `taskkill`, since
  git-bash `pkill` can't see it).
- **Still not visually verified by me** — same caveat as always, no
  screenshot/browser tool here. This was a direct response to specific
  visual feedback, so it especially needs Andrei's own eyes before
  moving on.

## 2026-07-25 — "New project" / reset button

Andrei asked for a reset button — start a clean project from scratch.

- **`projectStore.ts`**: new `newProject()` action — fresh `projectId`, name
  back to the default, `createdAt` reset, `voxels` cleared to `{}` (truly
  empty, not the 3-cube demo seed — a returning user resetting on purpose
  wants a blank grid, not the tutorial state), history cleared.
- **Confirmation is mandatory, not optional** — this wipes unsaved work
  and the target audience is kids who click fast. Built a small reusable
  `ConfirmDialog` (`src/components/ConfirmDialog.tsx` + `.css`) rather than
  a native `window.confirm()`, since a browser-chrome dialog would clash
  with the rest of the redesigned UI and isn't touch/kid friendly. Dialog
  message explicitly reminds them to Save or Screenshot first.
- Extracted the backdrop+panel shell that `ChallengePanel` already had
  into shared `.modal-backdrop` / `.modal-panel` classes in `hud.css`, and
  refactored `ChallengePanel.css` to use them instead of duplicating —
  `ConfirmDialog` composes the same two classes. New `.btn-pill--danger`
  variant added to `hud.css` (coral, matches the design tokens) for the
  destructive "Да, стереть" action.
- New button lives in `FileMenu`, first in the row (New → Save → Open →
  Screenshot → Export model, matching the conventional file-menu order),
  using Lucide's `FilePlus2` icon (page + folded corner + plus — verified
  shape by reading the source `.mjs`, per [[design-approach]]).
- On confirm: clears voxels, also calls `exitChallenge()` so a reset always
  drops back to sandbox mode rather than leaving a stale challenge target
  active over an empty grid.
- `npm run build` passes clean. Not visually verified by me — same
  standing caveat, please click through it yourself.

## 2026-07-25 — confirm dialog was rendering inside the toolbar, not centered

Andrei's screenshot showed the reset confirmation squeezed inside the tiny
file-menu bar with scrollbars, not centered on screen — called it out
sharply ("ублюдочный вариант"). Root cause, not a styling tweak:

- `ConfirmDialog` used `position: fixed`, which should escape any parent
  and center on the viewport. But its caller (`FileMenu`) renders it as a
  child of `.file-menu.hud-panel`, and `.hud-panel` sets
  `backdrop-filter: blur(10px)`. Per spec, `backdrop-filter` (like
  `transform`/`filter`/`will-change`) establishes a **containing block**
  for fixed-position descendants — so the dialog wasn't fixed to the
  viewport at all, it was fixed *inside that small blurred panel box*,
  explaining exactly what the screenshot showed.
- Every HUD cluster in this app (`EditorHud`, `FileMenu`, `ViewPresets`)
  uses `.hud-panel`, so this would have broken *any* dialog rendered
  inline inside them, not just this one.
- **Fix:** `ConfirmDialog` now renders via `createPortal(..., document.body)`
  instead of inline JSX — it's immune to whatever ancestor it's mounted
  under, permanently, rather than relying on callers to remember not to
  nest it under a filtered/transformed container.
- Also added the second thing asked for: a dedicated **"Стереть всё"**
  (erase all) button in the main `Toolbar`, next to Undo/Redo — distinct
  from `FileMenu`'s "New project" (which also resets project identity/
  name and clears history). This one just empties the grid and pushes the
  clear onto undo history (`clearVoxels()` in `projectStore.ts`), so an
  accidental "yes" is one Ctrl+Z away from safe, and is disabled when the
  grid is already empty. Trash2 icon from Lucide, shape verified by
  reading source per [[design-approach]].
- `npm run build` clean. Not visually re-verified by me — please check the
  dialog is actually centered now and the new toolbar button reads clearly.

## 2026-07-25 — GitHub repo, README, GitHub Pages deploy

Andrei asked to get this onto GitHub with a real README and a live deploy.

- **Repo:** created `AndreiPabiarzhyn/voxcel-3d` (public, matches his other
  portfolio repos' convention), pushed the initial commit (74 files) via
  `gh repo create --source=. --push`.
- **README.md** replaced (was still the unedited Vite template) with a real
  one: what the app is, feature list, tech stack, dev commands, deploy note,
  credit line, live-site link.
- **GitHub Pages via Actions** (`.github/workflows/deploy.yml`): builds on
  every push to `master` and publishes `dist/` using the official
  `actions/upload-pages-artifact` + `actions/deploy-pages`. Enabled Pages on
  the repo itself with `build_type: workflow` via `gh api`.
- **Base-path bugs this surfaced** — a project Pages site is served at
  `/voxcel-3d/`, not domain root, and that broke things a plain root deploy
  wouldn't have:
  - `vite.config.ts` needed `base: '/voxcel-3d/'`. Vite's own asset
    pipeline (index.html `<link>`/`<script>` tags, CSS `url()` refs like the
    self-hosted font `@font-face` rules) gets this rewritten automatically —
    verified by inspecting the built `dist/index.html` and CSS directly
    rather than assuming.
  - What Vite does **not** rewrite: plain runtime string literals passed to
    things like `<img src>`. The three challenge icon paths
    (`/icons/challenges/*.svg`, added earlier this session) were hardcoded
    absolute paths and would have 404'd in production while working fine
    in local dev — classic "works on my machine" trap. Fixed by building
    them from `import.meta.env.BASE_URL` instead (verified the built JS
    bundle actually contains `/voxcel-3d/icons/challenges/` baked in).
  - `public/manifest.json`'s `start_url` and icon `src` fields were also
    root-absolute (`/`, `/icon-192.png`); fixed to relative (`.`,
    `icon-192.png`) so they resolve against the manifest's own URL
    regardless of what path prefix it's served under — more robust than
    hardcoding the repo name a second time.
  - Also means local `npm run dev` now serves at
    `http://localhost:5173/voxcel-3d/`, not `/` — root now 302-redirects
    there. Worth remembering next time the dev server is opened.
- **CI lockfile fix**: first deploy run failed — `npm ci` on the Linux
  runner rejected `package-lock.json` as out of sync (`EUSAGE`, missing
  `@emnapi/*` entries, `sharp`'s optional cross-platform deps that hadn't
  made it into the lockfile committed from local Windows installs). Fixed
  by a full `rm -rf node_modules package-lock.json && npm install` to
  regenerate a complete lockfile, committed separately, re-ran clean.
- **Verified this one live**, not just by reasoning: confirmed the deploy
  workflow run succeeded (`gh run list`/`gh run view`), then `curl`-checked
  the actual production URL and every category of asset (HTML, JS, CSS,
  font, challenge icon, manifest) for a real 200 — all green.

**Live:** https://andreipabiarzhyn.github.io/voxcel-3d/
**Repo:** https://github.com/AndreiPabiarzhyn/voxcel-3d

## 2026-07-25 — layout split (bottom = core tools only, left = colors/challenge/clear) + colorful action icons

Andrei's message started with a keyboard-layout-garbled line again (typed
in Cyrillic while the OS layout was Latin) — decoded the same way as
before, key-by-key ЙЦУКЕН↔QWERTY: "ckeifq/ lfdfq hfpytctv ytvyjuj
bycnhevtyns/" → "слушай, давай разнесём немного инструменты" (listen,
let's spread the tools out a bit). Followed by plain-text instructions:
bottom bar should hold only the core actions (place/paint/erase/undo-redo),
the left side should get color picker + challenge + clear-all, and the
toolbar/challenge icons still needed to become real colorful pictures (the
challenge button specifically called out as "unclear").

**Layout split:**
- `EditorHud` (bottom-center) now wraps *only* `Toolbar` — place/paint/
  erase, divider, undo/redo. Nothing else.
- New `SidePanel` (`src/features/editor/SidePanel.tsx` + `.css`), fixed to
  the left edge and vertically centered (`top: 50%`, own scroll if the
  viewport is too short) — holds `Palette`, a divider, `ChallengesButton`,
  and a new "Стереть всё" button (moved out of `Toolbar`, unchanged
  `clearVoxels()` behavior/confirm dialog from the previous session).
  `Palette` switched from a horizontal scrolling row to a 2-column CSS grid
  since it's a vertical panel now.
- Added `.hud-panel--column` and `.hud-divider--h` utilities to `hud.css`
  so a panel can be laid out vertically using the same shared primitives
  instead of a bespoke one-off.

**Colorful action icons** — same reasoning as the challenge badges: a
6-10 y/o reads a real colored picture faster than a grey stroke glyph.
Downloaded more Twemoji SVGs (self-hosted, `public/icons/actions/`),
inspected each one's actual fill colors before choosing it (not guessed
from the name):
  - place → 🧱 brick (reddish isometric block stack)
  - paint → 🖌️ paintbrush (blue bristle tip, wood handle)
  - erase → 🧽 sponge (yellow/orange, bubbly texture)
  - clear all → 🗑️ wastebasket (the one icon that's mostly grey/white in
    Twemoji's own palette — kept anyway since no better *colorful* emoji
    maps to "empty the whole grid" as unambiguously)
  - challenge button → 🎯 dartboard+arrow (red/white rings, blue arrow) —
    directly answers "channel icon unclear": a bullseye-with-dart reads as
    "goal/challenge" far faster than Lucide's plain outline `Target`
  - undo/redo → the Unicode "leftwards/rightwards arrow with hook"
    (↩️/↪️) Twemoji glyphs turned out to already be small blue rounded-
    square badges with a white hooked arrow — i.e. Twemoji ships these as
    a colored icon, not a bare glyph, so no separate custom badge
    treatment was needed.
- Removed the now-unused Lucide re-exports (`PlaceIcon`, `PaintIcon`,
  `EraseIcon`, `ClearAllIcon`, `UndoIcon`, `RedoIcon`, `ChallengesIcon`)
  from `features/editor/icons.tsx` — confirmed unused via grep before
  deleting, not assumed.
- `npm run build` and `npm run lint` (oxlint) both clean.
- Verified every new icon file actually resolves with a 200 on the running
  dev server (`/voxcel-3d/icons/actions/*.svg`). **Layout/visual result
  itself not verified by me** — no screenshot tool here; please look at the
  new left panel and bottom bar and confirm the split reads right and
  nothing overlaps at your window size.

## 2026-07-25 — clearer erase icon, tool reorder, paint color popover

Andrei's message opened with another keyboard-layout typo this time in
plain text (not garbled, just typos — "потo", "покарсить", "проподает"),
asking for two things:

1. **Erase icon still unclear.** The sponge (🧽) was a plausible "wipe
   clean" metaphor but a stretch for "delete one placed cube." Swapped it
   for Twemoji's cross mark (❌, U+274C) — a big bold red X, about as fast
   to read as an icon gets, and the standard "remove/delete this" symbol
   in essentially every kids' app already. Same file
   (`public/icons/actions/erase.svg`), just different source SVG.

2. **Toolbar reorder + color picker redesign.** Requested order is
   place → erase → paint (was place → paint → erase) — done, plain
   reorder in `Toolbar.tsx`.
   The bigger change: the always-visible color swatches (which had just
   moved into the left `SidePanel` last session) move again — this time
   into a **popover anchored to the Paint button itself**, matching
   exactly what Andrei described: click "Покрасить" → a small card of
   color circles appears above the button; picking one selects the color
   and closes the popover; moving the mouse off the whole area (button +
   popover) also closes it, without picking anything.
   - `Palette` now takes an optional `onSelect` callback (fired after
     `setColor`) so a caller can react to a pick; `SidePanel` no longer
     renders `Palette` at all — it's just `ChallengesButton` + "Стереть
     всё" now, colors live only in the toolbar popover.
   - The trickiest part was the "closes on mouse leave" requirement: a
     naive absolutely-positioned popover with a visual gap above the
     button creates a dead pixel strip that belongs to neither element,
     so the cursor traveling from button to popover would hit that gap,
     get treated as "left the wrapper," and close the popover before the
     mouse ever reaches it (`mouseleave`/`mouseenter` are resolved by DOM
     ancestry of the actual hit-tested element under the cursor, not by
     bounding-box math — a transparent gap with nothing rendered in it
     belongs to whatever's behind it, not to the wrapper). Fixed by
     giving the popover wrapper an invisible `padding-bottom` buffer
     (`.tool-color-picker__popover`) so the wrapper's own hit-testable box
     reaches all the way down to touch the button — no dead gap, the
     visual spacing comes from padding *inside* an element instead of
     empty space *between* two elements.
   - Palette's own grid went from 2 columns (tall, meant for the narrow
     vertical side panel) to 4 columns (a compact 4×3 card, better suited
     to floating above a button in the bottom-center toolbar).
- `npm run build` and `npm run lint` clean.
- Not visually re-verified by me (no screenshot tool) — please confirm
  the popover actually stays open while moving the mouse from the button
  up into the color grid, and that the new erase icon reads clearly.

## 2026-07-25 — restored left color panel, fixed the broken popover, hammer/paint composite icons

Andrei pushed back hard on the previous change: the left-side color panel
should never have been removed ("это не трогай" — don't touch that), the
paint-button popover "doesn't work" at all, and the icons still looked
unchanged to him. Mid-message he also asked for a specific new icon
concept: a hammer breaking a brick for erase, and a paint roller painting
a brick wall for fill.

**Restored the left panel.** My read last time — "colors move into the
popover instead of the side panel" — was wrong; he wanted *both*: the
permanent side-panel swatches back exactly as they were, *plus* a working
popover on the paint button as an additional/faster way to pick a color.
`SidePanel` renders `Palette` again. Since `Palette` is now used in two
places with different available width, gave it an optional `className`
prop: default CSS is back to a 2-column grid (fits the narrow side panel),
and the popover passes `palette--wide` for a 4-column layout instead.

**Root-caused why the popover "didn't work".** It wasn't a logic bug in
the open/close handlers — the popover was rendering, but invisible.
`.editor-hud` (the bottom toolbar's wrapper) sets `overflow-y: hidden` to
support horizontal scrolling without a vertical scrollbar on narrow
windows (an earlier fix). Any absolutely-positioned child that pokes out
the top of that box — exactly what a popover anchored `bottom: 100%` on
a button inside it does — gets clipped by that overflow rule. Fixed by
portalling the popover straight to `document.body` (`createPortal`, same
technique already used for `ConfirmDialog`), with its position computed
from the paint button's own `getBoundingClientRect()` instead of CSS
`position: relative` on an ancestor.
- Portalling breaks the DOM-ancestry trick from the previous attempt
  (padding-buffer to keep hover continuous) since the popover is no longer
  a DOM descendant of the button's wrapper. Replaced it with the standard
  hover-intent pattern: leaving either the button or the popover schedules
  a close 150ms later; entering either one cancels that pending close.
  Robust regardless of any visual gap or portal boundary.

**"You didn't change the icons."** Likely real cause: the action icons
lived in `public/icons/actions/*.svg`, referenced by a plain unhashed
string path — exactly the kind of URL browsers cache aggressively with no
way to bust it on redeploy. Moved all of them into `src/assets/actionIcons/`
and switched every reference to an ES `import`, so Vite fingerprints them
into the build. They turned out small enough (all under Vite's 4kb
inline threshold) to get inlined as base64 `data:` URIs directly inside
the already content-hashed JS bundle — even more robust than a separate
hashed file, since there's no longer a second cacheable URL at all for
this class of asset.

**New icon concept — a tool acting on a brick, not just a bare emoji.**
Per the specific request: erase = hammer breaking a brick, fill = a
brick wall being painted. Twemoji has no "paint roller" emoji (checked
before assuming one didn't exist rather than improvising), so used the
paintbrush already on hand instead of hand-drawing one, on the same
composited-brick concept as the hammer — flagged this substitution
explicitly rather than silently deciding it was close enough. Built a
small `ComboIcon` (place's brick dimmed to 55% opacity as a backdrop,
the actual tool — hammer or paintbrush — crisp on top, bottom-right,
with a drop-shadow for separation) instead of hand-drawing a fused
scene, keeping both layers real verified Twemoji assets per
[[design-approach]] rather than fabricating new artwork.
- `npm run build` and `npm run lint` clean; confirmed via grep that the
  icons are actually inlined as `data:image/svg+xml` in the built JS.
- Not visually verified by me (no screenshot/browser tool) — please
  check the popover now actually stays open while moving from the paint
  button into the color grid, and whether the hammer/brick and
  paintbrush/brick combo reads clearly at the toolbar's icon size.

## 2026-07-25 — flipped icon emphasis, custom tooltips (no paint roller exists)

Follow-up to the hammer/brick combo icons: "good, but put the emphasis on
the hammer/brush, not the brick — the brick should be small in the back."
Also asked again specifically for a paint *roller*, and separately asked
to improve how tooltips look and bump their font size a bit.

- **Flipped `ComboIcon` proportions** (`Toolbar.tsx`/`.css`): the tool
  (hammer/paintbrush) is now the full-size, crisp, dominant icon; the
  brick shrank to a small 13px dimmed accent tucked in the bottom-left
  corner. Previously it was backwards — brick large, tool a small corner
  badge — which is exactly what read wrong.
- **Checked, don't have a paint roller.** Verified before answering
  rather than guessing: fetched Unicode's official emoji list and
  GitHub's `gemoji` dataset and searched both for "roller" — no paint
  roller emoji exists in the Unicode standard as of this writing. Per
  [[design-approach]] (verified real assets only, no hand-drawn art),
  kept the paintbrush as the closest real substitute rather than
  fabricating a roller icon myself — flagging this substitution
  explicitly instead of quietly deciding it was close enough.
- **Custom `Tooltip` component** (`src/components/Tooltip.tsx` + `.css`)
  replacing native browser `title` attributes across every icon-only HUD
  button (`Toolbar`, `SidePanel`, `FileMenu`, `ViewPresets`,
  `ChallengesButton`): a styled dark pill in the app's own Nunito/token
  system, bigger and more legible than the tiny native OS tooltip,
  400ms hover delay to avoid flicker on a quick mouse pass.
  - Portalled to `document.body` and positioned from the trigger's own
    `getBoundingClientRect()` — same technique as the color-picker
    popover and `ConfirmDialog`, for the same reason: several of these
    buttons live inside `hud-panel`s that clip overflow (`.editor-hud`,
    `.side-panel`), so a plain CSS-relative tooltip would've been
    clipped exactly like the color popover was before that fix.
  - Caught a real collision before it shipped: the paint button already
    opens its own color-picker popover in roughly the same screen
    position a tooltip would occupy above it. Added an optional
    `disabled` prop to `Tooltip` and pass `disabled={colorsOpen}` on
    that one button, so the two floating cards never stack.
- `npm run build` / `npm run lint` clean. Not visually verified by me —
  please check the new icon proportions and hover the buttons to see the
  custom tooltips (and confirm the paint button's tooltip correctly stays
  away while its color popover is open).

## 2026-07-25 — tooltip clipped at screen top + palette swatches still native

Screenshot showed the "Вид сверху" tooltip in the top-left `ViewPresets`
row cut off by the actual browser viewport edge — the tooltip always
rendered *above* its button, and that button sits at `top: 16px`, leaving
nowhere for an "above" tooltip to fit without going off-screen. Separately,
the individual color swatches in `Palette` were never switched over from
the earlier turn — still plain `title` attributes, so still native OS
tooltips there while every other button got the custom styled one.

- **`Tooltip.tsx`**: now checks the anchor's distance from the top of the
  viewport (`rect.top < 48px` of clearance) and flips to rendering
  *below* the button instead of above when there isn't room — same
  `getBoundingClientRect`-driven positioning as before, just no longer
  hardcoded to one side. Also clamps the horizontal position so it can't
  slide off the left/right edges either (a bug that hadn't been hit yet
  but was clearly next in line, given the top-edge one had just fired for
  the same reason). Bubble also gained a `max-width` + centered wrapping
  instead of `white-space: nowrap`, since some labels (the .glb export
  one) are full sentences that could otherwise force the tooltip wider
  than the viewport.
- **`Palette.tsx`**: swatches now wrapped in the same `<Tooltip>` used
  everywhere else, `title` attribute removed. Palette is a CSS grid of
  36px cells; wrapping each button in an `inline-flex` tooltip-anchor
  span didn't change the grid sizing (grid tracks constrain the span the
  same way they constrained the button directly).
- `npm run build` / `npm run lint` clean. Not visually re-verified by me
  — please check the top-row view-preset tooltips now appear below the
  buttons instead of getting cut off, and that hovering a color swatch
  now shows the same styled tooltip as everything else.

## 2026-07-25 — starter pig build + "keep it or start fresh" welcome modal

Andrei asked for a proper starting build instead of the old 3-cube demo:
a low-poly Minecraft-style pig standing ready on launch, plus a modal
asking whether to keep it or start blank — keep → pig stays as the
project; new → empty grid. Increase the grid only if the pig actually
needs more room.

- **`src/lib/voxel/starterPig.ts`** (new) — `buildStarterPig()`, built the
  same way the challenge shapes are (a small box-fill helper + hand-picked
  coordinates, not anything generated): 4 legs, a body, a head, two ears,
  a small darker-pink snout nub on the lower face, and a tail. Two colors
  total (`#f2a9c3` body pink, `#e087a8` snout pink) — no attempt at
  texture-level detail like eyes, since at this voxel resolution a single
  flat-colored cube for an eye wouldn't read as an eye, just as a stray
  block. Silhouette (legs + boxy body/head + snout nub) is what carries
  "pig" here, same principle the house/tree/mushroom challenge shapes
  already lean on.
- **Grid size:** computed the pig's bounding box before touching
  anything — 5 wide × 5 tall × 10 long — and it centers perfectly inside
  the existing default 12×12×12 grid (x 4-7, y 0-4, z 1-10, all within
  0-11) with room to spare. Left `DEFAULT_GRID_SIZE` at 12, unchanged —
  enlarging it wasn't actually needed, and bumping it would have nudged
  the already-centered challenge shapes (house/tree/mushroom, centered
  via their own hardcoded offsets assuming a 12-wide grid) slightly
  off-center for no real benefit.
- **`projectStore.ts`**: `seedVoxels()` (the old 3-cube demo) replaced by
  `buildStarterPig()` as the fallback when there's no autosaved project
  yet. Added `showWelcome` (true only when `loadProjectFromLocalStorage()`
  returned `null` — i.e. a genuinely fresh visit) plus two actions:
  `keepStarterPig()` and `dismissStarterPig()` (the latter calls the
  existing `newProject()` then saves). Both explicitly call
  `saveProjectToLocalStorage()` immediately — autosave only fires on the
  *next* edit, so without this, choosing "keep the pig" wouldn't actually
  persist anything and the same welcome modal would silently reappear on
  every reload until the player happened to place a block.
- **`WelcomeModal.tsx`** (new) — reuses the existing `ConfirmDialog`
  rather than building a new dialog shell: title "Привет! 🐷", explains the
  pig, "Оставить свинку" (ghost button, keeps it) vs "Новый проект"
  (the coral/danger button — it does discard the free starter content,
  so the existing destructive-action styling fits). Mounted once in
  `App.tsx`.
- `npm run build` / `npm run lint` clean.
- **Testing note for Andrei**: this only triggers on a *genuinely* empty
  `localStorage` — the browser tab already open from this session almost
  certainly autosaved a project earlier today, so reloading it won't show
  the pig or the modal. Use a private/incognito window (or clear
  `localStorage` for the site in devtools) to see the actual first-visit
  experience. Not visually verified by me for the same reason — no
  browser tool here, and no way to simulate "empty localStorage" myself.

## 2026-07-25 — camera centered on the grid, challenge start now asks to save, better house + Among Us build

Andrei shared a screenshot of the default camera framing he liked and
said the pig was hard to find in it — plus asked for three more things:
a save-prompt before a challenge wipes the grid, a proper house (the old
one was just a flat two-tone box), and swapping the mushroom challenge
for an Among Us crewmate.

**Root-caused the camera issue, not just nudged numbers.** Voxels render
at world position = their raw index (`Voxel.tsx`: `position={[x,y,z]}`,
no centering offset), so the grid's visual middle — where `GroundPlane`/
`GroundGrid` already center themselves via `(size-1)/2`, and where the
starter pig sits — is *not* the world origin. But `Canvas`'s camera had
no explicit OrbitControls `target`, so it defaulted to looking at
`(0,0,0)` — a corner of the grid, not its middle. That's exactly why the
pig felt hard to catch: the camera's pivot point was the wrong spot.
- Fix, in `Scene.tsx` + `CameraRig.tsx`: compute `center = (gridSize-1)/2`
  once, shift the Canvas's initial camera position by that same amount
  (`[center+10, 9, center+10]` instead of the hardcoded `[10,9,10]`), and
  set `controls.target.set(center, 0, center)` imperatively in
  `CameraRig`'s mount effect — *before* `registerCamera` captures the
  "home" position/target, so the Home view preset also inherits the fix.
  Deliberately did **not** pass `target` as a live prop on
  `<OrbitControls>`: drei re-syncs that prop via effect dependency on the
  array reference, and an inline `[center, 0, center]` array is a new
  reference every render — meaning the target would snap back to center
  on every state change (e.g. every single voxel placed), fighting the
  custom pan/orbit logic. Setting it once imperatively avoids that
  entirely. Net result: identical camera angle/zoom to before (same
  relative offset), just re-centered on the grid's middle instead of a
  corner — so the pig (and anything else built near the middle) sits in
  frame by default, consistently on every fresh load.

**Challenge start now offers a save prompt.** `startChallenge` didn't
touch the grid before — a challenge's target was just overlaid as a
ghost on top of whatever was already there. Andrei wants challenges to
start from a clean grid, but asked for a save-or-not question first.
`ChallengePanel.tsx`: clicking "Начать"/"Ещё раз" now checks if the grid
has anything on it; if so, a `ConfirmDialog` asks whether to save first
(reusing the exact `.voxcel` download logic from `FileMenu`, pulled out
into a shared `lib/storage/exportProjectFile.ts` so it isn't duplicated
a third time) — either choice then clears the grid and starts the
challenge. Swapped which button gets which style from the usual
confirm/cancel default: "Сохранить и начать" is the safe ghost-styled
button (and what a stray backdrop click falls back to), "Не сохранять"
gets the red/danger styling, since discarding unsaved work is the
actually-risky path here.
- Caught a real bug while wiring this up: `ConfirmDialog` is portalled
  to `document.body`, and React re-fires portalled events along the
  *React* tree, not the DOM tree — so a click on this new dialog's own
  backdrop would keep bubbling into `ChallengePanel`'s own
  backdrop-click-to-close handler (the first time a `ConfirmDialog` has
  ever been nested inside another click-handling backdrop). Fixed by
  calling `stopPropagation()` on `ConfirmDialog`'s own backdrop click
  before invoking `onCancel` — makes it fully self-contained for any
  future nesting too, not just this one call site.

**Proper house.** The old one was a 3x3 box for two layers plus a
solid-color "roof" layer — no pitch, no door, no windows, barely reads
as a house. New `buildHouse()`: 5x5 walls (3 tall), a roof that steps in
to a 3x3 layer then a single-cube peak, a real 1-wide 2-tall doorway (an
actual gap in the target — cells simply omitted, not just recolored —
with the lintel row above staying filled), and a window on each side
wall. Added a small `box()` helper alongside the existing `square()` one
for stamping a color across a range of y-layers instead of just one.

**Among Us instead of the mushroom.** `buildAmongUs()`: a tapered
stack of square layers (3→5→5→5→5→3) approximating the bean-shaped body,
a light-blue visor band across the upper-front face, and a small
backpack bump on the back — same "silhouette over surface detail"
principle as the pig's snout and the house's door, since a single
flat-colored voxel can't render a 2D texture. For the challenge-card
badge icon, there's no official "Among Us" emoji to source (it's a
specific trademarked character design, not a Unicode symbol) — used the
Twemoji astronaut instead (verified real asset, thematically the closest
fit: Among Us characters are essentially cartoon spaceship crewmates)
rather than fabricating a bespoke icon, per [[design-approach]].
Old `mushroom.svg` deleted; new `amongus.svg` added under
`public/icons/challenges/`.
- `npm run build` / `npm run lint` clean. Camera fix, house, and Among Us
  build are **not visually verified by me** — no browser tool here.
  Please check the default view now frames the pig/grid center properly,
  and that the new house/Among Us target shapes actually read as
  intended in the 3D view.

## 2026-07-25 — softened the challenge ghost overlay

Andrei's message was terse and unaccompanied by a screenshot this time
("Белее, прозрачнее сделать, иначе мешает" — "make it whiter, more
transparent, otherwise it's in the way"), with no explicit subject. Best
guess given what we'd just been testing (the house/Among Us challenge
targets): the translucent ghost-overlay cubes in `ChallengeGhost.tsx`,
which render at the target's actual color and 0.25 opacity — solid
enough to visually compete with real placed cubes while building against
a challenge target. **Flagged this assumption explicitly to Andrei** in
case the actual target was something else.

- `ChallengeGhost.tsx`: each ghost cube's color is now blended 70% toward
  white (`new Color(target).lerp(new Color('#ffffff'), 0.7)`, memoized
  per unique target color across all challenges) instead of the raw
  target color, and opacity dropped from 0.25 to 0.12 — reads as a soft
  white-tinted hint rather than a solid, visually competing block.
- `npm run build` / `npm run lint` clean. Not visually verified by me —
  please confirm this is actually what felt "in the way," and that it's
  subtle enough now without losing the hint entirely.

## 2026-07-25 — the ghost overlay fix from an hour ago was itself the bug

Andrei's screenshot of the Among Us/house ghost shape showed a dense
mesh of glowing white wireframe lines, worst in the middle — reacted
sharply ("что это за говно"). Also asked to bring back the color hint
(what color each part is meant to be).

Root cause: the *previous* change (blend toward white + keep `<Edges>`)
was the actual regression. `<Edges>` draws a full wireframe outline
per individual unit cube; a challenge target is dozens of adjacent
ghost cubes, so every shared internal face between two touching ghost
cubes got its own outline too, on both sides — at the white-blended
color, that's a dense lattice of near-white lines, densest exactly
where the most cubes touch (the middle of the shape). Whitening the
fill made the problem worse, not better, since the edges got brighter
too.

Fix: removed the `<Edges>` outline entirely — plain transparent fill
only. Reverted the color back to the target's real color (undoing the
white-blend from the last change, per "верни подсветку цвета" — bring
the color hint back) and set opacity to 0.2 (between the original 0.25
and the too-faint 0.12 attempt), since without the outline crutch the
fill alone needs to be visible enough to still convey "this part should
be red/brown/etc."

`npm run build` / `npm run lint` clean. Not visually verified by me —
please confirm the mesh of lines is gone and the color hint reads
clearly again without feeling solid/in-the-way.

## 2026-07-25 — .glb export colors weren't surviving import into Roblox

Andrei reported that after downloading a build as .glb and importing it
into Roblox, all the color information was gone (flat white/grey model).

The export code (`exportModel.ts`) set each material's `color` property
(glTF's `baseColorFactor`) directly and attached no texture. That's
perfectly valid, spec-compliant glTF — Blender, three.js, and most
proper PBR viewers read `baseColorFactor` correctly — but Roblox's mesh
importer (and a number of other simplified glTF consumers) reads a
material's base color *texture*, not the numeric factor. With no texture
present, there's nothing for it to sample, hence flat white.

Fixed by baking each distinct voxel color into a tiny (8x8) solid-color
canvas texture and assigning it as the material's `map`, leaving `color`
at its default white (so `factor(white) × texture(realColor) = realColor`
— unchanged, correct behavior for tools that *do* respect
`baseColorFactor`, while now also giving texture-only importers like
Roblox an actual pixel to read). Textures get disposed alongside their
materials after the export completes, same as before.

Not able to verify this myself end-to-end (no Roblox Studio access here)
— please re-export a build and confirm the colors now come through on
import. `npm run build` / `npm run lint` clean.

---

Also this session: the GitHub Pages deploy for the previous commit got
stuck in `in_progress` for 8+ minutes on the `deploy-pages` step alone
(build itself finished in 17s) — looked like a one-off GitHub-side
hiccup, not a project issue. Cancelled it (`gh run cancel`) and
re-triggered a fresh deploy via `gh workflow run deploy.yml`
(`workflow_dispatch`, already wired up in `deploy.yml`), which completed
normally on the retry.

## 2026-07-25 — hint toggle button (lightbulb) for challenge mode

Andrei asked for a top-center "lightbulb" button, visible only while a
challenge is active, that shows/hides the ghost-overlay hint so a kid
can test themselves without the answer key and bring it back if stuck.

- `challengeStore.ts`: new `hintVisible` (default `true`) + `toggleHint()`.
  Reset to `true` whenever a challenge (re)starts, so it's never stuck
  hidden from a previous attempt.
- `ChallengeGhost.tsx`: now also checks `hintVisible` before rendering
  the ghost cubes — but the completion-detection `useEffect` (the one
  that fires the "Готово!" toast) deliberately does **not** depend on it,
  so hiding the hint doesn't also pause progress tracking.
- New `HintButton.tsx` (`features/challenges/`), fixed top-center,
  renders nothing unless `activeChallengeId` is set. Uses the Twemoji
  lightbulb (💡, self-hosted under `src/assets/actionIcons/`, same
  ES-import/content-hashing treatment as the toolbar icons) rather than
  a monochrome icon, and lights up gold (`hud-button--active-gold`,
  matching the existing "active" convention) while the hint is showing.
- `npm run build` / `npm run lint` clean. Not visually verified by me —
  please start a challenge and confirm the lightbulb appears, toggles
  the ghost cubes, and disappears again once you leave the challenge.

## 2026-07-25 — hygiene pass

Andrei asked for a tech-debt/hygiene check after a long run of rapid
iterative changes. Went through the codebase looking specifically for
drift the fast pace could plausibly have left behind, found and fixed
four concrete things, and identified a few bigger ones worth a
deliberate decision rather than a silent fix:

**Fixed:**
- `features/editor/icons.tsx` had a stale comment claiming the action
  icons were "self-hosted under public/icons/actions/" and read via a
  `BASE_URL` string — that description described how they worked
  *before* the caching fix a few turns back moved them to
  `src/assets/actionIcons/` as ES imports. Corrected it; a wrong comment
  is worse than no comment.
- `hud.css` had `.chip`, `.chip--gold`, `.chip--success` — ~20 lines of
  CSS with zero remaining usages anywhere (`grep` confirmed), left over
  from the challenge-panel redesign that replaced them with the
  icon-badge/corner-checkmark pattern. Deleted.
- `hasVoxels` (whether the grid has anything worth confirming before a
  destructive action) was computed independently, slightly differently,
  in both `ChallengePanel.tsx` and `SidePanel.tsx`. Extracted a single
  `selectHasVoxels` selector in `projectStore.ts` and pointed both at it
  — one definition of "empty" instead of two that could quietly drift.
- The challenge-card icons (house/tree/amongus) were still sitting in
  `public/icons/challenges/`, referenced by a `BASE_URL`-built string —
  exactly the same stale-cache class of bug fixed for the toolbar action
  icons two sessions ago, just never extended here. Moved them to
  `src/assets/challengeIcons/` as ES imports too, for the same reason
  (Vite content-hashes them; all three ended up small enough to inline
  as base64 directly in the JS bundle, confirmed via grep on the built
  output). Also deleted the now-empty `public/icons/` directory entirely
  — nothing under `public/` references a raw icon path anymore, only
  favicon/manifest/PWA icons and fonts remain there, which genuinely
  need stable public URLs.

**Flagged, not changed (bigger, worth a deliberate yes/no rather than a
silent edit):**
- No `strict: true` in `tsconfig.app.json` — only a partial set
  (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`).
  Full strict mode (`strictNullChecks`, `noImplicitAny`, etc.) usually
  pays for itself, but turning it on could surface an unknown number of
  existing errors across the whole codebase — a scoped decision, not a
  drive-by fix.
- Oxlint isn't running in type-aware mode — the project's own
  auto-generated README already suggests enabling `typeAware: true` +
  `oxlint-tsgolint` as an optional upgrade; never acted on.
- Zero automated tests anywhere in the project. Reasonable for how fast
  this has moved so far, but worth naming plainly rather than leaving
  implicit.
- Vite warns on every build that the main JS chunk is >500kB minified
  (~340kB gzipped) — inherent to bundling Three.js + R3F + drei with no
  route-based code-splitting opportunity in a single-view app. Flagging
  for awareness, not treating as urgent.

`npm run build` / `npm run lint` clean after the fixes.

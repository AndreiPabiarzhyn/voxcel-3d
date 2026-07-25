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

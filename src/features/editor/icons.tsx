// Every icon here comes from Lucide (ISC-licensed, lucide.dev) rather than
// hand-drawn shapes — battle-tested glyphs read faster at a glance than a
// bespoke attempt, which matters a lot when the audience is 6-10 y/o kids
// who can't lean on the text label if the picture is ambiguous. Re-exported
// under names that describe the ACTION in this app, not the glyph, so
// callers stay readable if the underlying icon ever changes.
export {
  Camera as ScreenshotIcon, // a real camera — "take a picture of this"
  Blocks as PlaceIcon, // two joined blocks — "place a block", not just "a cube"
  PaintBucket as PaintIcon, // tilting bucket + drip — the universal "fill/recolor" icon,
  // and the exact metaphor MS Paint/Paint 3D/Scratch already taught this age group
  Eraser as EraseIcon, // a real eraser silhouette with the diagonal "worn corner" cut
  Trash2 as ClearAllIcon, // trash can — "throw away everything on the grid"
  Undo2 as UndoIcon, // hooked arrow — standard undo
  Redo2 as RedoIcon, // mirror of Undo2
  Download as DownloadIcon, // arrow into a tray — save/export a file
  FolderOpen as FolderIcon, // open folder — load a file
  Box as ExportModelIcon, // labeled 3D cube — "this becomes a 3D model file"
  FilePlus2 as NewProjectIcon, // blank page with a folded corner + plus — "start a new one"
  House as HomeIcon, // reset the camera to its starting view
  Eye as FrontViewIcon, // "look straight at it" — front view
  Grid3x3 as TopViewIcon, // floor grid seen flat — straight-down view
  Target as ChallengesIcon, // a bullseye — "here's a goal to aim for"
  CheckCircle2 as CompletedIcon, // filled checkmark badge — challenge already done
  X as CloseIcon, // close the challenge panel
} from 'lucide-react'

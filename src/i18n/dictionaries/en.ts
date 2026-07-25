import type { Translations } from '../types'

// Source language — every other dictionary is written to match this one
// key-for-key.
export const en: Translations = {
  common: {
    cancel: 'Never mind',
  },
  toolbar: {
    place: 'Add Block',
    erase: 'Erase Block',
    paint: 'Paint',
    undoTooltip: 'Undo (Ctrl+Z)',
    undoLabel: 'Undo',
    redoTooltip: 'Redo (Ctrl+Y)',
    redoLabel: 'Redo',
  },
  sidePanel: {
    clearAllTooltip: 'Erase all blocks',
    clearAllLabel: 'Erase all',
    clearAllConfirmTitle: 'Erase everything?',
    clearAllConfirmMessage:
      'All the blocks on the grid will be removed. You can undo this with the Undo button.',
    clearAllConfirmYes: 'Yes, erase all',
  },
  fileMenu: {
    newProjectTooltip: 'Start a new project (erases the current build)',
    newProjectLabel: 'Start new project',
    saveTooltip: 'Save project (.voxcel)',
    saveLabel: 'Save project to a file',
    openTooltip: 'Open project (.voxcel)',
    openLabel: 'Open project from a file',
    screenshotTooltip: 'Save a picture (.png)',
    screenshotLabel: 'Take a screenshot',
    exportModelTooltip: 'Export as a 3D model (.glb) — for games and other apps',
    exportModelLabel: 'Export 3D model',
    newProjectConfirmTitle: 'Start a new project?',
    newProjectConfirmMessage:
      'The current build will be erased. If you want to keep it, save the project or take a screenshot first.',
    newProjectConfirmYes: 'Yes, erase it',
  },
  toast: {
    projectSaved: 'Project saved to a file 💾',
    screenshotSaved: 'Screenshot saved 📸',
    newProjectStarted: 'New project started ✨',
    projectOpened: 'Project opened! 🎉',
    projectOpenError: "Couldn't open the file — is it really a .voxcel file? 🤔",
    modelExported: '3D model saved to a file 📦',
    allCleared: 'All cleared 🧹',
    challengeComplete: 'Done! You built: {{title}} 🎉',
  },
  viewPresets: {
    home: 'Default view',
    front: 'Front view',
    top: 'Top view',
  },
  challenges: {
    buttonLabel: 'Challenges',
    close: 'Close',
    completedBadge: 'Done',
    actionPlaying: 'Playing',
    actionRetry: 'Try again',
    actionStart: 'Start',
    sandboxMode: 'Free mode (no challenge)',
    saveBeforeStartTitle: 'Save your current build?',
    saveBeforeStartMessage:
      "The challenge starts on an empty grid — whatever you've already built will be erased. Save your build to a file first?",
    saveBeforeStartDiscard: "Don't save",
    saveBeforeStartSave: 'Save and start',
    houseTitle: 'House',
    houseHint: 'Build a house with a door, windows, and a roof',
    treeTitle: 'Tree',
    treeHint: 'Build a fluffy tree',
    amongUsTitle: 'Among Us',
    amongUsHint: 'Build an Among Us character',
  },
  hint: {
    show: 'Show hint',
    hide: 'Hide hint',
    label: 'Hint',
  },
  welcome: {
    title: 'Hi there! 🐷',
    message:
      'We made you a starter figure — a pig made of blocks. Want to keep it and keep building, or start with a blank grid?',
    keepPig: 'Keep the pig',
    startNew: 'New project',
  },
  palette: {
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    cyan: 'Light Blue',
    blue: 'Blue',
    purple: 'Purple',
    pink: 'Pink',
    brown: 'Brown',
    white: 'White',
    black: 'Black',
    gray: 'Gray',
  },
  project: {
    defaultName: 'My Build',
  },
  language: {
    buttonLabel: 'Language',
  },
}

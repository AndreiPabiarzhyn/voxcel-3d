export type LanguageCode = 'en' | 'pl' | 'it' | 'es' | 'tr' | 'ru' | 'pt' | 'id'

// Every language dictionary must implement every one of these keys —
// TypeScript enforces that at compile time (`tsc -b` fails on a missing
// key), which matters a lot here since there's no other safety net
// catching a partially-translated language.
export interface Translations {
  common: {
    cancel: string
  }
  toolbar: {
    place: string
    erase: string
    paint: string
    undoTooltip: string
    undoLabel: string
    redoTooltip: string
    redoLabel: string
  }
  sidePanel: {
    clearAllTooltip: string
    clearAllLabel: string
    clearAllConfirmTitle: string
    clearAllConfirmMessage: string
    clearAllConfirmYes: string
  }
  fileMenu: {
    newProjectTooltip: string
    newProjectLabel: string
    saveTooltip: string
    saveLabel: string
    openTooltip: string
    openLabel: string
    screenshotTooltip: string
    screenshotLabel: string
    exportModelTooltip: string
    exportModelLabel: string
    newProjectConfirmTitle: string
    newProjectConfirmMessage: string
    newProjectConfirmYes: string
  }
  toast: {
    projectSaved: string
    screenshotSaved: string
    newProjectStarted: string
    projectOpened: string
    projectOpenError: string
    modelExported: string
    allCleared: string
    /** Contains a `{{title}}` placeholder — interpolated by useTranslation. */
    challengeComplete: string
  }
  viewPresets: {
    home: string
    front: string
    top: string
  }
  challenges: {
    buttonLabel: string
    close: string
    completedBadge: string
    actionPlaying: string
    actionRetry: string
    actionStart: string
    sandboxMode: string
    saveBeforeStartTitle: string
    saveBeforeStartMessage: string
    saveBeforeStartDiscard: string
    saveBeforeStartSave: string
    houseTitle: string
    houseHint: string
    treeTitle: string
    treeHint: string
    amongUsTitle: string
    amongUsHint: string
  }
  hint: {
    show: string
    hide: string
    label: string
  }
  welcome: {
    title: string
    message: string
    keepPig: string
    startNew: string
  }
  palette: {
    red: string
    orange: string
    yellow: string
    green: string
    cyan: string
    blue: string
    purple: string
    pink: string
    brown: string
    white: string
    black: string
    gray: string
  }
  project: {
    defaultName: string
  }
  language: {
    buttonLabel: string
  }
}

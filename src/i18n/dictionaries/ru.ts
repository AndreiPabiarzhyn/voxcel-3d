import type { Translations } from '../types'

// The original strings this whole app was built with — copied verbatim
// from each component rather than re-translated, so behavior is
// byte-for-byte the same as before i18n existed.
export const ru: Translations = {
  common: {
    cancel: 'Не надо',
  },
  toolbar: {
    place: 'Добавить блок',
    erase: 'Стереть блок',
    paint: 'Покрасить',
    undoTooltip: 'Отменить (Ctrl+Z)',
    undoLabel: 'Отменить',
    redoTooltip: 'Вернуть (Ctrl+Y)',
    redoLabel: 'Вернуть',
  },
  sidePanel: {
    clearAllTooltip: 'Стереть все кубики',
    clearAllLabel: 'Стереть всё',
    clearAllConfirmTitle: 'Стереть всё?',
    clearAllConfirmMessage:
      'Все кубики на сетке будут удалены. Это действие можно отменить кнопкой «Отменить».',
    clearAllConfirmYes: 'Да, стереть всё',
  },
  fileMenu: {
    newProjectTooltip: 'Начать новый проект (стереть текущую постройку)',
    newProjectLabel: 'Начать новый проект',
    saveTooltip: 'Сохранить проект (.voxcel)',
    saveLabel: 'Сохранить проект в файл',
    openTooltip: 'Открыть проект (.voxcel)',
    openLabel: 'Открыть проект из файла',
    screenshotTooltip: 'Сохранить картинку (.png)',
    screenshotLabel: 'Сделать скриншот',
    exportModelTooltip: 'Экспортировать как 3D-модель (.glb) — для игр и других программ',
    exportModelLabel: 'Экспортировать 3D-модель',
    newProjectConfirmTitle: 'Начать новый проект?',
    newProjectConfirmMessage:
      'Текущая постройка будет стёрта. Если хочешь сохранить её — сначала нажми «Сохранить проект» или сделай скриншот.',
    newProjectConfirmYes: 'Да, стереть',
  },
  toast: {
    projectSaved: 'Проект сохранён в файл 💾',
    screenshotSaved: 'Скриншот сохранён 📸',
    newProjectStarted: 'Новый проект начат ✨',
    projectOpened: 'Проект открыт! 🎉',
    projectOpenError: 'Не получилось открыть файл — это точно файл .voxcel? 🤔',
    modelExported: '3D-модель сохранена в файл 📦',
    allCleared: 'Всё стёрто 🧹',
    challengeComplete: 'Готово! Ты собрал: {{title}} 🎉',
  },
  viewPresets: {
    home: 'Обычный вид',
    front: 'Вид спереди',
    top: 'Вид сверху',
  },
  challenges: {
    buttonLabel: 'Задания',
    close: 'Закрыть',
    completedBadge: 'Готово',
    actionPlaying: 'Играю',
    actionRetry: 'Ещё раз',
    actionStart: 'Начать',
    sandboxMode: 'Свободный режим (без задания)',
    saveBeforeStartTitle: 'Сохранить текущую постройку?',
    saveBeforeStartMessage:
      'Задание начинается с чистой сетки — то, что уже построено, будет стёрто. Сохранить постройку в файл перед началом?',
    saveBeforeStartDiscard: 'Не сохранять',
    saveBeforeStartSave: 'Сохранить и начать',
    houseTitle: 'Домик',
    houseHint: 'Собери домик с дверью, окнами и крышей',
    treeTitle: 'Ёлочка',
    treeHint: 'Собери пушистую ёлочку',
    amongUsTitle: 'Амогус',
    amongUsHint: 'Собери персонажа из Among Us',
  },
  hint: {
    show: 'Показать подсказку',
    hide: 'Скрыть подсказку',
    label: 'Подсказка',
  },
  welcome: {
    title: 'Привет! 🐷',
    message:
      'Мы приготовили для тебя стартовую фигурку — свинку из кубиков. Оставить её и достраивать дальше, или начать с чистого листа?',
    keepPig: 'Оставить свинку',
    startNew: 'Новый проект',
  },
  palette: {
    red: 'Красный',
    orange: 'Оранжевый',
    yellow: 'Жёлтый',
    green: 'Зелёный',
    cyan: 'Голубой',
    blue: 'Синий',
    purple: 'Фиолетовый',
    pink: 'Розовый',
    brown: 'Коричневый',
    white: 'Белый',
    black: 'Чёрный',
    gray: 'Серый',
  },
  project: {
    defaultName: 'Моя постройка',
  },
  language: {
    buttonLabel: 'Язык',
  },
}

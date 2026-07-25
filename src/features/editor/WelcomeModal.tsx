import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useProjectStore } from '../../store/projectStore'

export function WelcomeModal() {
  const showWelcome = useProjectStore((state) => state.showWelcome)
  const keepStarterPig = useProjectStore((state) => state.keepStarterPig)
  const dismissStarterPig = useProjectStore((state) => state.dismissStarterPig)

  if (!showWelcome) return null

  return (
    <ConfirmDialog
      title="Привет! 🐷"
      message="Мы приготовили для тебя стартовую фигурку — свинку из кубиков. Оставить её и достраивать дальше, или начать с чистого листа?"
      confirmLabel="Новый проект"
      cancelLabel="Оставить свинку"
      onConfirm={dismissStarterPig}
      onCancel={keepStarterPig}
    />
  )
}

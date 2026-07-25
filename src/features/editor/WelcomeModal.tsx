import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useTranslations } from '../../i18n/useTranslations'
import { useProjectStore } from '../../store/projectStore'

export function WelcomeModal() {
  const t = useTranslations()
  const showWelcome = useProjectStore((state) => state.showWelcome)
  const keepStarterPig = useProjectStore((state) => state.keepStarterPig)
  const dismissStarterPig = useProjectStore((state) => state.dismissStarterPig)

  if (!showWelcome) return null

  return (
    <ConfirmDialog
      title={t.welcome.title}
      message={t.welcome.message}
      confirmLabel={t.welcome.startNew}
      cancelLabel={t.welcome.keepPig}
      onConfirm={dismissStarterPig}
      onCancel={keepStarterPig}
    />
  )
}

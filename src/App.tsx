import { ChallengePanel } from './features/challenges/ChallengePanel'
import { HintButton } from './features/challenges/HintButton'
import './App.css'
import { Credit } from './features/editor/Credit'
import { EditorHud } from './features/editor/EditorHud'
import { FileMenu } from './features/editor/FileMenu'
import { SidePanel } from './features/editor/SidePanel'
import { ToastHost } from './features/editor/ToastHost'
import { useHistoryShortcuts } from './features/editor/useHistoryShortcuts'
import { ViewPresets } from './features/editor/ViewPresets'
import { WelcomeModal } from './features/editor/WelcomeModal'
import { Scene } from './scene/Scene'

function App() {
  useHistoryShortcuts()

  return (
    <div className="app">
      <Scene />
      <EditorHud />
      <SidePanel />
      <FileMenu />
      <ViewPresets />
      <HintButton />
      <Credit />
      <ToastHost />
      <ChallengePanel />
      <WelcomeModal />
    </div>
  )
}

export default App

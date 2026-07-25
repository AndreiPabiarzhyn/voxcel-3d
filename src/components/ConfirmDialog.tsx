import { createPortal } from 'react-dom'
import './ConfirmDialog.css'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Portalled straight to <body>: every caller so far lives inside a
  // `.hud-panel` (backdrop-filter), which creates a containing block for
  // `position: fixed` descendants — without the portal this dialog gets
  // boxed inside that small toolbar instead of centering on the viewport.
  //
  // React re-fires portalled events along the *React* tree, not the DOM
  // tree — so a click here would otherwise keep bubbling into whatever
  // component logically renders this dialog (ChallengePanel nests one
  // inside its own backdrop-click-to-close div). stopPropagation on the
  // outer backdrop keeps this dialog fully self-contained regardless of
  // where it's used.
  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(event) => {
        event.stopPropagation()
        onCancel()
      }}
    >
      <div className="modal-panel confirm-dialog" onClick={(event) => event.stopPropagation()}>
        <h2 className="confirm-dialog__title">{title}</h2>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="btn-pill btn-pill--ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn-pill btn-pill--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

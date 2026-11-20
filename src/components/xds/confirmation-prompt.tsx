/**
 * Confirmation Prompt
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */
import { Fragment, useId, type ComponentProps, type ReactNode } from "react"
import {
  Ban,
  Check,
  CircleAlert,
  CirclePause,
  Loader2,
  Pencil,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/xds/button"

export type ConfirmationPromptStatus =
  | "pending"
  | "confirming"
  | "confirmed"
  | "cancelled"
  | "error"

export type ConfirmationPromptIntent = "default" | "destructive"

export type ConfirmationPromptField = {
  label: string
  value: ReactNode
}

export type ConfirmationPromptProps = Omit<
  ComponentProps<"section">,
  "title"
> & {
  /** The single action awaiting approval, e.g. "Send email to Leadership team" */
  title: string
  description?: ReactNode
  icon?: ReactNode
  intent?: ConfirmationPromptIntent
  fields?: ConfirmationPromptField[]
  /** `true` shows the default warning; pass a node for custom wording */
  irreversible?: boolean | ReactNode
  status?: ConfirmationPromptStatus
  onConfirm: () => void
  onCancel: () => void
  /** Sends the user back to revise their request */
  onEdit?: () => void
  confirmLabel?: string
  cancelLabel?: string
  editLabel?: string
  errorMessage?: ReactNode
  ariaLabel?: string
}

const statusLabel: Record<ConfirmationPromptStatus, string> = {
  pending: "Needs your approval",
  confirming: "Confirming…",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  error: "Failed",
}

function StatusIcon({ status }: { status: ConfirmationPromptStatus }) {
  const base = "size-4 shrink-0"

  switch (status) {
    case "confirming":
      return (
        <Loader2
          aria-hidden="true"
          className={cn(
            base,
            "animate-spin text-accent-brand motion-reduce:animate-none"
          )}
        />
      )
    case "confirmed":
      return <Check aria-hidden="true" className={cn(base, "text-green-600")} />
    case "cancelled":
      return (
        <Ban aria-hidden="true" className={cn(base, "text-muted-foreground")} />
      )
    case "error":
      return (
        <CircleAlert aria-hidden="true" className={cn(base, "text-destructive")} />
      )
    default:
      return (
        <CirclePause aria-hidden="true" className={cn(base, "text-warning")} />
      )
  }
}

function ConfirmationPrompt({
  title,
  description,
  icon,
  intent = "default",
  fields,
  irreversible,
  status = "pending",
  onConfirm,
  onCancel,
  onEdit,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  editLabel = "Edit",
  errorMessage = "Something went wrong. Nothing was changed.",
  ariaLabel,
  className,
  children,
  ...props
}: ConfirmationPromptProps) {
  const baseId = useId()
  const descriptionId = `${baseId}-description`
  const warningId = `${baseId}-warning`
  const errorId = `${baseId}-error`

  const isActionable = status === "pending" || status === "error"
  const isDestructive = intent === "destructive"
  const warning =
    irreversible === true ? "This can't be undone." : irreversible || null
  const describedBy =
    [description && descriptionId, warning && warningId]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <section
      aria-describedby={describedBy}
      aria-label={ariaLabel ?? `Confirm: ${title}`}
      data-slot="confirmation-prompt"
      data-intent={intent}
      data-status={status}
      className={cn(
        "w-full overflow-hidden rounded-lg bg-card text-sm text-card-foreground ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      <div
        data-slot="confirmation-prompt-header"
        className="flex min-h-11 items-center gap-2 px-4 py-2"
      >
        <span
          className={cn(
            "flex shrink-0 [&_svg]:size-4",
            isDestructive ? "text-destructive" : "text-accent-brand"
          )}
        >
          {icon ?? <ShieldAlert aria-hidden="true" />}
        </span>
        <h3
          data-slot="confirmation-prompt-title"
          className={cn(
            "min-w-0 flex-1 font-medium",
            status === "cancelled" && "text-muted-foreground"
          )}
        >
          {title}
        </h3>
        <span
          aria-live="polite"
          data-slot="confirmation-prompt-status"
          className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
        >
          <StatusIcon status={status} />
          {statusLabel[status]}
        </span>
      </div>

      <div
        data-slot="confirmation-prompt-content"
        className="space-y-3 border-t border-border px-4 py-3"
      >
        {description && (
          <p
            data-slot="confirmation-prompt-description"
            className="text-muted-foreground"
            id={descriptionId}
          >
            {description}
          </p>
        )}
        {fields && fields.length > 0 && (
          <dl
            data-slot="confirmation-prompt-fields"
            className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1"
          >
            {fields.map((field) => (
              <Fragment key={field.label}>
                <dt className="text-muted-foreground">{field.label}</dt>
                <dd className="min-w-0 break-words">{field.value}</dd>
              </Fragment>
            ))}
          </dl>
        )}
        {children && (
          <div
            aria-label="Preview"
            data-slot="confirmation-prompt-preview"
            className="max-h-48 overflow-y-auto rounded-lg bg-muted p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            role="region"
            tabIndex={0}
          >
            {children}
          </div>
        )}
        {warning && (
          <p
            data-slot="confirmation-prompt-warning"
            className="flex items-start gap-2 font-medium"
            id={warningId}
          >
            <TriangleAlert
              aria-hidden="true"
              className={cn(
                "mt-0.5 size-4 shrink-0",
                isDestructive ? "text-destructive" : "text-warning"
              )}
            />
            {warning}
          </p>
        )}
        {status === "error" && (
          <p
            data-slot="confirmation-prompt-error"
            className="text-destructive"
            id={errorId}
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <div
        data-slot="confirmation-prompt-footer"
        className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3"
      >
        <Button
          aria-describedby={
            [warning && warningId, status === "error" && errorId]
              .filter(Boolean)
              .join(" ") || undefined
          }
          disabled={!isActionable}
          size="sm"
          type="button"
          variant={isDestructive ? "destructive" : "default"}
          onClick={onConfirm}
        >
          {status === "confirming" && (
            <Loader2
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          )}
          {confirmLabel}
        </Button>
        {onEdit && (
          <Button
            disabled={!isActionable}
            size="sm"
            type="button"
            variant="outline"
            onClick={onEdit}
          >
            <Pencil aria-hidden="true" />
            {editLabel}
          </Button>
        )}
        <Button
          className="ml-auto"
          disabled={!isActionable}
          size="sm"
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      </div>
    </section>
  )
}

export { ConfirmationPrompt }

/**
 * Permission Request
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */
import { useId, type ComponentProps, type ReactNode } from "react"
import {
  Ban,
  Check,
  CircleAlert,
  CirclePause,
  CornerDownRight,
  Eye,
  KeyRound,
  Loader2,
  PencilLine,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/xds/button"

export type PermissionRequestStatus =
  | "pending"
  | "granting"
  | "granted"
  | "declined"
  | "error"

export type PermissionAccess = "read" | "write"

export type PermissionScope = {
  label: ReactNode
  access?: PermissionAccess
}

export type PermissionRequestProps = Omit<ComponentProps<"section">, "title"> & {
  /** e.g. "Allow access to your Outlook calendar?" */
  title: string
  /** Why the assistant needs access */
  reason: ReactNode
  /** What the assistant will access */
  scopes?: PermissionScope[]
  /** What happens if the user continues without granting access */
  fallback: ReactNode
  icon?: ReactNode
  status?: PermissionRequestStatus
  onAllow: () => void
  onContinueWithout: () => void
  allowLabel?: string
  continueLabel?: string
  scopesLabel?: string
  fallbackLabel?: string
  errorMessage?: ReactNode
  ariaLabel?: string
}

const statusLabel: Record<PermissionRequestStatus, string> = {
  pending: "Needs your permission",
  granting: "Connecting…",
  granted: "Access granted",
  declined: "Continuing without access",
  error: "Couldn't connect",
}

const accessConfig: Record<
  PermissionAccess,
  { icon: typeof Eye; label: string }
> = {
  read: { icon: Eye, label: "Read" },
  write: { icon: PencilLine, label: "Read and change" },
}

function StatusIcon({ status }: { status: PermissionRequestStatus }) {
  const base = "size-4 shrink-0"

  switch (status) {
    case "granting":
      return (
        <Loader2
          aria-hidden="true"
          className={cn(
            base,
            "animate-spin text-accent-brand motion-reduce:animate-none"
          )}
        />
      )
    case "granted":
      return <Check aria-hidden="true" className={cn(base, "text-green-600")} />
    case "declined":
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

function PermissionRequest({
  title,
  reason,
  scopes,
  fallback,
  icon,
  status = "pending",
  onAllow,
  onContinueWithout,
  allowLabel = "Allow access",
  continueLabel = "Continue without access",
  scopesLabel = "Will access",
  fallbackLabel = "Without access:",
  errorMessage = "Couldn't connect. Nothing was shared.",
  ariaLabel,
  className,
  ...props
}: PermissionRequestProps) {
  const baseId = useId()
  const reasonId = `${baseId}-reason`
  const scopesId = `${baseId}-scopes`
  const fallbackId = `${baseId}-fallback`
  const errorId = `${baseId}-error`

  const isActionable = status === "pending" || status === "error"

  return (
    <section
      aria-describedby={reasonId}
      aria-label={ariaLabel ?? `Permission request: ${title}`}
      data-slot="permission-request"
      data-status={status}
      className={cn(
        "w-full overflow-hidden rounded-lg bg-card text-sm text-card-foreground ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      <div
        data-slot="permission-request-header"
        className="flex min-h-11 items-center gap-2 px-4 py-2"
      >
        <span className="flex shrink-0 text-accent-brand [&_svg]:size-4">
          {icon ?? <KeyRound aria-hidden="true" />}
        </span>
        <h3
          data-slot="permission-request-title"
          className={cn(
            "min-w-0 flex-1 font-medium",
            status === "declined" && "text-muted-foreground"
          )}
        >
          {title}
        </h3>
        <span
          aria-live="polite"
          data-slot="permission-request-status"
          className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
        >
          <StatusIcon status={status} />
          {statusLabel[status]}
        </span>
      </div>

      <div
        data-slot="permission-request-content"
        className="space-y-3 border-t border-border px-4 py-3"
      >
        <p
          data-slot="permission-request-reason"
          className="text-muted-foreground"
          id={reasonId}
        >
          {reason}
        </p>
        {scopes && scopes.length > 0 && (
          <div data-slot="permission-request-scopes">
            <p className="mb-1 font-medium" id={scopesId}>
              {scopesLabel}
            </p>
            <ul aria-labelledby={scopesId} className="space-y-1">
              {scopes.map((scope, index) => {
                const { icon: AccessIcon, label } =
                  accessConfig[scope.access ?? "read"]

                return (
                  <li
                    key={index}
                    data-access={scope.access ?? "read"}
                    data-slot="permission-request-scope"
                    className="flex items-start gap-2"
                  >
                    <AccessIcon
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="min-w-0">
                      <span className="sr-only">{label}: </span>
                      {scope.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <p
          data-slot="permission-request-fallback"
          className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2"
          id={fallbackId}
        >
          <CornerDownRight
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          />
          <span className="min-w-0">
            <span className="font-medium">{fallbackLabel}</span> {fallback}
          </span>
        </p>
        {status === "error" && (
          <p
            data-slot="permission-request-error"
            className="text-destructive"
            id={errorId}
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <div
        data-slot="permission-request-footer"
        className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3"
      >
        <Button
          aria-describedby={status === "error" ? errorId : undefined}
          disabled={!isActionable}
          size="sm"
          type="button"
          onClick={onAllow}
        >
          {status === "granting" && (
            <Loader2
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          )}
          {allowLabel}
        </Button>
        <Button
          aria-describedby={fallbackId}
          disabled={!isActionable}
          size="sm"
          type="button"
          variant="outline"
          onClick={onContinueWithout}
        >
          {continueLabel}
        </Button>
      </div>
    </section>
  )
}

export { PermissionRequest }

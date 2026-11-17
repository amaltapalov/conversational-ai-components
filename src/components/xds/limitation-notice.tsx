/**
 * Limitation Notice
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */
import { useId, useState, type ComponentProps, type ReactNode } from "react"
import {
  ChevronDown,
  CircleDashed,
  CircleHelp,
  History,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/xds/button"

export type LimitationKind = "stale" | "permission" | "uncertain" | "partial"

export type LimitationNoticeProps = Omit<ComponentProps<"div">, "title"> & {
  kind: LimitationKind
  /** The factual limitation, e.g. "Based on data up to 12 Oct 2026" */
  title: ReactNode
  /** Overrides the screen-reader prefix for the kind */
  label?: string
  icon?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  detailsLabel?: string
  actionLabel?: string
  onAction?: () => void
  ariaLabel?: string
}

const kindConfig: Record<LimitationKind, { icon: LucideIcon; label: string }> = {
  stale: { icon: History, label: "Out of date" },
  permission: { icon: LockKeyhole, label: "No access" },
  uncertain: { icon: CircleHelp, label: "Uncertain" },
  partial: { icon: CircleDashed, label: "Incomplete" },
}

function LimitationNotice({
  kind,
  title,
  label,
  icon,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  detailsLabel = "Details",
  actionLabel,
  onAction,
  ariaLabel,
  className,
  children,
  ...props
}: LimitationNoticeProps) {
  const detailId = useId()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : internalOpen

  const { icon: KindIcon, label: kindLabel } = kindConfig[kind]
  const hasDetail = Boolean(children)
  const hasAction = Boolean(actionLabel && onAction)

  function toggle() {
    const next = !isOpen
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div
      aria-label={ariaLabel}
      data-slot="limitation-notice"
      data-kind={kind}
      role="note"
      className={cn(
        "w-full border-l-2 border-border pl-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-2">
        <span
          data-slot="limitation-notice-icon"
          className="mt-0.5 flex shrink-0 [&_svg]:size-4"
        >
          {icon ?? <KindIcon aria-hidden="true" />}
        </span>
        <p data-slot="limitation-notice-title" className="min-w-0 flex-1">
          <span className="sr-only">{label ?? kindLabel}: </span>
          {title}
        </p>
        {(hasDetail || hasAction) && (
          <div className="-my-0.5 flex shrink-0 items-center gap-1">
            {hasDetail && (
              <Button
                aria-controls={detailId}
                aria-expanded={isOpen}
                data-slot="limitation-notice-toggle"
                size="xs"
                type="button"
                variant="tertiary"
                onClick={toggle}
              >
                {detailsLabel}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "transition-transform motion-reduce:transition-none",
                    isOpen && "rotate-180"
                  )}
                />
              </Button>
            )}
            {hasAction && (
              <Button
                data-slot="limitation-notice-action"
                size="xs"
                type="button"
                variant="outline"
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
      {hasDetail && (
        <div
          data-slot="limitation-notice-detail"
          hidden={!isOpen}
          id={detailId}
          className="mt-1 pl-6 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export { LimitationNotice }

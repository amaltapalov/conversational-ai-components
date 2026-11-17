/**
 * Response Status
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */
import type { ComponentProps } from "react"
import { Loader2, Square } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/xds/button"
import type { StreamOfThoughtStatus } from "@/components/xds/stream-of-thought"
import {
  formatDuration,
  responseActivityLabel,
  streamStatusLabel,
  type ResponseActivity,
} from "@/lib/thought-vocabulary"

export type { ResponseActivity }

export type ResponseStatusProps = Omit<ComponentProps<"div">, "children"> & {
  status?: StreamOfThoughtStatus
  activity?: ResponseActivity
  label?: string
  /** Seconds */
  elapsed?: number
  onStop?: () => void
  stopLabel?: string
}

function ResponseStatus({
  className,
  status = "thinking",
  activity = "reasoning",
  label,
  elapsed,
  onStop,
  stopLabel = "Stop",
  ...props
}: ResponseStatusProps) {
  if (status === "complete") return null

  const isActive = status === "thinking"
  const text =
    label ??
    (isActive ? `${responseActivityLabel[activity]}…` : streamStatusLabel[status])

  return (
    <div
      data-slot="response-status"
      data-status={status}
      data-activity={activity}
      className={cn(
        "inline-flex max-w-full items-center gap-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <span
        role="status"
        className="inline-flex min-w-0 items-center gap-2"
      >
        {isActive && (
          <Loader2
            aria-hidden="true"
            className="size-4 shrink-0 animate-spin text-accent-brand motion-reduce:animate-none"
          />
        )}
        <span
          data-slot="response-status-label"
          className={cn(
            "truncate",
            isActive && "animate-pulse motion-reduce:animate-none",
            status === "error" && "text-destructive"
          )}
        >
          {text}
        </span>
      </span>
      {elapsed !== undefined && (
        <span
          data-slot="response-status-elapsed"
          className="shrink-0 text-xs tabular-nums"
        >
          {formatDuration(elapsed)}
        </span>
      )}
      {isActive && onStop && (
        <Button size="xs" type="button" variant="outline" onClick={onStop}>
          <Square aria-hidden="true" />
          {stopLabel}
        </Button>
      )}
    </div>
  )
}

export { ResponseStatus }

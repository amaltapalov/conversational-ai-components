import { useId, useState, type ReactNode } from "react"
import {
  Brain,
  Check,
  ChevronDown,
  Circle,
  CircleAlert,
  CirclePause,
  Code,
  FileText,
  Loader2,
  RotateCcw,
  Search,
  Square,
  Wrench,
  X,
} from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/xds/button"
import type { CitationItem } from "@/components/xds/citations"
import { getSafeHref } from "@/lib/utils"

/**
 * Stream of Thought
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */

export type ThoughtStepStatus =
  | "queued"
  | "running"
  | "waiting"
  | "error"
  | "retried"
  | "complete"

export type ThoughtStepKind = "reasoning" | "search" | "read" | "tool" | "code"

export type StreamOfThoughtStatus =
  | "thinking"
  | "waiting"
  | "complete"
  | "error"
  | "stopped"

export type ThoughtStepDetail = {
  input?: string
  code?: string
  language?: string
  output?: string
}

export type ThoughtStep = {
  id: string
  title: string
  status: ThoughtStepStatus
  kind?: ThoughtStepKind
  description?: string
  detail?: ThoughtStepDetail
  sources?: CitationItem[]
  /** Seconds */
  duration?: number
  /** Set when the step succeeded after a retry */
  retried?: boolean
}

export type StreamOfThoughtProps = {
  status: StreamOfThoughtStatus
  steps: ThoughtStep[]
  /** Total elapsed seconds */
  duration?: number
  summary?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onStop?: () => void
  onApprove?: (stepId: string) => void
  onReject?: (stepId: string) => void
  onRetry?: (stepId: string) => void
  className?: string
  ariaLabel?: string
}

const stepStatusLabel: Record<ThoughtStepStatus, string> = {
  queued: "Queued",
  running: "In progress",
  waiting: "Waiting for approval",
  error: "Failed",
  retried: "Retried",
  complete: "Completed",
}

const kindIcon: Record<ThoughtStepKind, typeof Brain> = {
  reasoning: Brain,
  search: Search,
  read: FileText,
  tool: Wrench,
  code: Code,
}

const kindLabel: Record<ThoughtStepKind, string> = {
  reasoning: "Reasoning",
  search: "Search",
  read: "Read",
  tool: "Tool call",
  code: "Code",
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))}s`
  const minutes = Math.floor(seconds / 60)
  const rest = Math.round(seconds % 60)
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`
}

function StepStatusIcon({ status }: { status: ThoughtStepStatus }) {
  const base = "size-4 shrink-0"

  switch (status) {
    case "running":
      return (
        <Loader2
          aria-hidden="true"
          className={cn(base, "animate-spin text-accent-brand motion-reduce:animate-none")}
        />
      )
    case "waiting":
      return <CirclePause aria-hidden="true" className={cn(base, "text-amber-600")} />
    case "error":
      return <CircleAlert aria-hidden="true" className={cn(base, "text-red-500")} />
    case "retried":
      return <RotateCcw aria-hidden="true" className={cn(base, "text-muted-foreground")} />
    case "complete":
      return <Check aria-hidden="true" className={cn(base, "text-green-600")} />
    default:
      return <Circle aria-hidden="true" className={cn(base, "text-muted-foreground/60")} />
  }
}

function getHeaderLabel(
  status: StreamOfThoughtStatus,
  duration: number | undefined
) {
  switch (status) {
    case "thinking":
      return "Thinking…"
    case "waiting":
      return "Waiting for approval"
    case "error":
      return "Something went wrong"
    case "stopped":
      return "Stopped"
    default:
      return duration !== undefined
        ? `Thought for ${formatDuration(duration)}`
        : "Finished thinking"
  }
}

function StreamOfThoughtDetail({
  detail,
  sources,
}: Pick<ThoughtStep, "detail" | "sources">) {
  const blocks = [
    { label: "Input", value: detail?.input },
    { label: detail?.language ? `Code · ${detail.language}` : "Code", value: detail?.code },
    { label: "Output", value: detail?.output },
  ].filter((block): block is { label: string; value: string } => Boolean(block.value))

  return (
    <div data-slot="stream-of-thought-detail" className="mt-2 space-y-3">
      {blocks.map((block) => (
        <div key={block.label} className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{block.label}</p>
          <pre className="overflow-x-auto bg-muted p-3 font-mono text-xs leading-relaxed text-foreground">
            <code>{block.value}</code>
          </pre>
        </div>
      ))}
      {sources && sources.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Sources
          </p>
          <ul className="flex flex-wrap gap-2">
            {sources.map((source) => {
              const label = [source.title, source.source]
                .filter(Boolean)
                .join(" - ")

              return (
                <li key={source.id} className="max-w-full">
                  <a
                    className="flex w-fit max-w-full items-center rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    href={getSafeHref(source.href)}
                    rel="noreferrer"
                    target="_blank"
                    title={label}
                  >
                    <span className="min-w-0 truncate">{label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

type StreamOfThoughtStepProps = {
  step: ThoughtStep
  isLast: boolean
  onApprove?: (stepId: string) => void
  onReject?: (stepId: string) => void
  onRetry?: (stepId: string) => void
}

function StreamOfThoughtStep({
  step,
  isLast,
  onApprove,
  onReject,
  onRetry,
}: StreamOfThoughtStepProps) {
  const KindIcon = step.kind ? kindIcon[step.kind] : null
  const hasDetail = Boolean(
    step.detail?.input ||
      step.detail?.code ||
      step.detail?.output ||
      step.sources?.length
  )

  const heading = (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <span
        className={cn(
          "min-w-0 truncate text-sm font-medium",
          step.status === "queued" && "text-muted-foreground",
          step.status === "running" && "animate-pulse motion-reduce:animate-none"
        )}
      >
        {step.title}
      </span>
      {KindIcon && step.kind && (
        <KindIcon
          aria-label={kindLabel[step.kind]}
          className="size-3.5 shrink-0 text-muted-foreground"
          role="img"
        />
      )}
      {step.retried && (
        <span className="shrink-0 border border-border px-1.5 text-[0.625rem] leading-4 text-muted-foreground uppercase">
          Retried
        </span>
      )}
      {step.duration !== undefined && step.status === "complete" && (
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
          {formatDuration(step.duration)}
        </span>
      )}
    </span>
  )

  return (
    <li
      data-slot="stream-of-thought-step"
      data-status={step.status}
      className="relative flex gap-3 pb-4 last:pb-0"
    >
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute top-6 bottom-1 left-2 w-px -translate-x-1/2 bg-border"
        />
      )}
      <span className="mt-0.5 flex size-4 items-center justify-center">
        <StepStatusIcon status={step.status} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="sr-only">{stepStatusLabel[step.status]}: </span>
        {hasDetail ? (
          <details className="group/step">
            <summary className="flex cursor-pointer list-none items-center gap-2 outline-none marker:hidden focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              {heading}
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 shrink-0 text-muted-foreground transition-transform group-open/step:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            {step.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            )}
            <StreamOfThoughtDetail detail={step.detail} sources={step.sources} />
          </details>
        ) : (
          <>
            <div className="flex items-center gap-2">{heading}</div>
            {step.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            )}
          </>
        )}

        {step.status === "waiting" && (onApprove || onReject) && (
          <div className="mt-2 flex gap-2">
            {onApprove && (
              <Button size="xs" type="button" onClick={() => onApprove(step.id)}>
                <Check aria-hidden="true" />
                Approve
              </Button>
            )}
            {onReject && (
              <Button
                size="xs"
                type="button"
                variant="outline"
                onClick={() => onReject(step.id)}
              >
                <X aria-hidden="true" />
                Reject
              </Button>
            )}
          </div>
        )}
        {step.status === "error" && onRetry && (
          <div className="mt-2">
            <Button
              size="xs"
              type="button"
              variant="outline"
              onClick={() => onRetry(step.id)}
            >
              <RotateCcw aria-hidden="true" />
              Retry
            </Button>
          </div>
        )}
      </div>
    </li>
  )
}

function StreamOfThought({
  status,
  steps,
  duration,
  summary,
  open: openProp,
  defaultOpen,
  onOpenChange,
  onStop,
  onApprove,
  onReject,
  onRetry,
  className,
  ariaLabel = "AI reasoning steps",
}: StreamOfThoughtProps) {
  const contentId = useId()
  const isActive = status === "thinking" || status === "waiting"
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? isActive)
  const [userToggled, setUserToggled] = useState(false)
  const [prevActive, setPrevActive] = useState(isActive)

  // Follow run state (open while active, collapse when done) until the user takes over.
  if (prevActive !== isActive) {
    setPrevActive(isActive)
    if (!userToggled) setInternalOpen(isActive)
  }

  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : internalOpen

  function toggle() {
    const next = !isOpen
    setUserToggled(true)
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const completedCount = steps.filter((step) => step.status === "complete").length
  const currentStep =
    steps.find((step) => step.status === "running" || step.status === "waiting") ??
    steps.find((step) => step.status === "error")
  const label = getHeaderLabel(status, duration)

  return (
    <section
      aria-label={ariaLabel}
      data-slot="stream-of-thought"
      data-status={status}
      className={cn(
        "w-full bg-card text-sm text-card-foreground ring-1 ring-foreground/10",
        className
      )}
    >
      <div
        data-slot="stream-of-thought-header"
        className="flex items-center gap-2 pr-2 transition-colors hover:bg-muted/50"
      >
        <button
          aria-controls={contentId}
          aria-expanded={isOpen}
          data-slot="stream-of-thought-trigger"
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 px-4 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          type="button"
          onClick={toggle}
        >
          {status === "thinking" ? (
            <Loader2
              aria-hidden="true"
              className="size-4 shrink-0 animate-spin text-accent-brand motion-reduce:animate-none"
            />
          ) : status === "waiting" ? (
            <CirclePause aria-hidden="true" className="size-4 shrink-0 text-amber-600" />
          ) : status === "error" ? (
            <CircleAlert aria-hidden="true" className="size-4 shrink-0 text-red-500" />
          ) : status === "stopped" ? (
            <Square aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <Brain aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="shrink-0 font-medium">{label}</span>
          <span
            aria-live="polite"
            className="min-w-0 truncate text-muted-foreground"
          >
            {isActive && currentStep ? currentStep.title : null}
          </span>
          {steps.length > 0 && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {isActive
                ? `${completedCount}/${steps.length}`
                : `${steps.length} ${steps.length === 1 ? "step" : "steps"}`}
            </span>
          )}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-accent-brand transition-transform motion-reduce:transition-none",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {status === "thinking" && onStop && (
          <Button size="xs" type="button" variant="outline" onClick={onStop}>
            <Square aria-hidden="true" />
            Stop
          </Button>
        )}
      </div>

      <div
        data-slot="stream-of-thought-content"
        hidden={!isOpen}
        id={contentId}
        className="border-t border-border px-4 py-4 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
      >
        {summary && (
          <div className="mb-4 text-sm text-muted-foreground">{summary}</div>
        )}
        <ol data-slot="stream-of-thought-steps" className="flex flex-col">
          {steps.map((step, index) => (
            <StreamOfThoughtStep
              key={step.id}
              isLast={index === steps.length - 1}
              step={step}
              onApprove={onApprove}
              onReject={onReject}
              onRetry={onRetry}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}

export { StreamOfThought }

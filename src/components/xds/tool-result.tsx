/**
 * Tool Result
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */
import {
  Fragment,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import {
  Ban,
  Check,
  ChevronDown,
  CircleAlert,
  Loader2,
  RotateCcw,
  Undo2,
  Wrench,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/xds/button"
import { formatDuration } from "@/lib/thought-vocabulary"

export type ToolResultStatus = "running" | "success" | "error" | "cancelled"

export type ToolResultField = {
  label: string
  value: ReactNode
}

export type ToolResultDetail = {
  input?: string
  output?: string
  language?: string
}

export type ToolResultProps = Omit<
  ComponentProps<"section">,
  "title" | "children"
> & {
  status: ToolResultStatus
  /** What the assistant did, e.g. "Saved notes to your workspace" */
  title: string
  /** Tool or integration name, e.g. "Workspace · save_file" */
  tool?: string
  icon?: ReactNode
  summary?: ReactNode
  fields?: ToolResultField[]
  detail?: ToolResultDetail
  /** Seconds */
  duration?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onRetry?: () => void
  onUndo?: () => void
  retryLabel?: string
  undoLabel?: string
  ariaLabel?: string
}

const statusLabel: Record<ToolResultStatus, string> = {
  running: "Running",
  success: "Completed",
  error: "Failed",
  cancelled: "Cancelled",
}

function ToolResultStatusIcon({ status }: { status: ToolResultStatus }) {
  const base = "size-4 shrink-0"

  switch (status) {
    case "running":
      return (
        <Loader2
          aria-hidden="true"
          className={cn(
            base,
            "animate-spin text-accent-brand motion-reduce:animate-none"
          )}
        />
      )
    case "success":
      return <Check aria-hidden="true" className={cn(base, "text-green-600")} />
    case "error":
      return (
        <CircleAlert aria-hidden="true" className={cn(base, "text-destructive")} />
      )
    default:
      return (
        <Ban aria-hidden="true" className={cn(base, "text-muted-foreground")} />
      )
  }
}

function ToolResult({
  status,
  title,
  tool,
  icon,
  summary,
  fields,
  detail,
  duration,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onRetry,
  onUndo,
  retryLabel = "Retry",
  undoLabel = "Undo",
  ariaLabel,
  className,
  ...props
}: ToolResultProps) {
  const contentId = useId()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : internalOpen

  const blocks = [
    {
      label: detail?.language ? `Input · ${detail.language}` : "Input",
      value: detail?.input,
    },
    { label: "Output", value: detail?.output },
  ].filter((block): block is { label: string; value: string } =>
    Boolean(block.value)
  )
  const hasFields = Boolean(fields?.length)
  const isExpandable = hasFields || blocks.length > 0
  const action =
    status === "error" && onRetry ? (
      <Button size="xs" type="button" variant="outline" onClick={onRetry}>
        <RotateCcw aria-hidden="true" />
        {retryLabel}
      </Button>
    ) : status === "success" && onUndo ? (
      <Button size="xs" type="button" variant="outline" onClick={onUndo}>
        <Undo2 aria-hidden="true" />
        {undoLabel}
      </Button>
    ) : null

  function toggle() {
    const next = !isOpen
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const heading = (
    <>
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center self-start">
        <ToolResultStatusIcon status={status} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "truncate font-medium",
            status === "running" && "animate-pulse motion-reduce:animate-none",
            status === "cancelled" && "text-muted-foreground"
          )}
        >
          <span aria-live="polite" className="sr-only">
            {statusLabel[status]}:{" "}
          </span>
          {title}
        </span>
        {(tool || summary) && (
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            {tool && (
              <span
                data-slot="tool-result-tool"
                className="flex shrink-0 items-center gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0"
              >
                {icon ?? <Wrench aria-hidden="true" />}
                {tool}
              </span>
            )}
            {tool && summary && <span aria-hidden="true">·</span>}
            {summary && (
              <span
                data-slot="tool-result-summary"
                className={cn(
                  "min-w-0 truncate",
                  status === "error" && "text-destructive"
                )}
              >
                {summary}
              </span>
            )}
          </span>
        )}
      </span>
      {duration !== undefined && status !== "running" && (
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {formatDuration(duration)}
        </span>
      )}
    </>
  )

  return (
    <section
      aria-label={ariaLabel ?? `Tool result: ${title}`}
      data-slot="tool-result"
      data-status={status}
      className={cn(
        "w-full overflow-hidden rounded-lg bg-card text-sm text-card-foreground ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      <div
        data-slot="tool-result-header"
        className={cn(
          "flex items-center gap-2",
          action && "pr-2",
          isExpandable && "transition-colors hover:bg-muted/50"
        )}
      >
        {isExpandable ? (
          <button
            aria-controls={contentId}
            aria-expanded={isOpen}
            data-slot="tool-result-trigger"
            className="flex min-h-11 min-w-0 flex-1 items-center gap-3 px-4 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            type="button"
            onClick={toggle}
          >
            {heading}
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 text-accent-brand transition-transform motion-reduce:transition-none",
                isOpen && "rotate-180"
              )}
            />
          </button>
        ) : (
          <div className="flex min-h-11 min-w-0 flex-1 items-center gap-3 px-4 py-2">
            {heading}
          </div>
        )}
        {action}
      </div>

      {isExpandable && (
        <div
          data-slot="tool-result-content"
          hidden={!isOpen}
          id={contentId}
          className="space-y-3 border-t border-border px-4 py-3 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
        >
          {hasFields && (
            <dl
              data-slot="tool-result-fields"
              className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1"
            >
              {fields?.map((field) => (
                <Fragment key={field.label}>
                  <dt className="text-muted-foreground">{field.label}</dt>
                  <dd className="min-w-0 break-words">{field.value}</dd>
                </Fragment>
              ))}
            </dl>
          )}
          {blocks.length > 0 && (
            <div data-slot="tool-result-detail" className="space-y-3">
              {blocks.map((block) => (
                <div key={block.label} className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {block.label}
                  </p>
                  <pre className="overflow-x-auto bg-muted p-3 font-mono text-xs leading-relaxed text-foreground">
                    <code>{block.value}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export { ToolResult }

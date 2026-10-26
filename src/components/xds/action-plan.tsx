import {
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import {
  Brain,
  Check,
  ChevronDown,
  CircleAlert,
  CircleSlash,
  Code,
  FileText,
  GripVertical,
  ListChecks,
  Loader2,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Wrench,
} from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/xds/button"
import { Textarea } from "@/components/xds/textarea"
import type { ThoughtStepKind } from "@/components/xds/stream-of-thought"

/**
 * Action Plan
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */

export type ActionPlanMode = "contractual" | "advisory"

export type ActionPlanStatus =
  | "draft"
  | "approved"
  | "running"
  | "complete"
  | "cancelled"

export type ActionPlanStepStatus =
  | "pending"
  | "running"
  | "complete"
  | "skipped"
  | "error"

export type ActionPlanStep = {
  id: string
  title: string
  description?: string
  kind?: ThoughtStepKind
  status?: ActionPlanStepStatus
  detail?: ReactNode
}

export type ActionPlanProps = {
  steps: ActionPlanStep[]
  /** Required for editing; omit to render a read-only plan */
  onStepsChange?: (steps: ActionPlanStep[]) => void
  mode?: ActionPlanMode
  status?: ActionPlanStatus
  /** Defaults to true for contractual drafts */
  editable?: boolean
  title?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onApprove?: (steps: ActionPlanStep[]) => void
  onRegenerate?: () => void
  onCancel?: () => void
  approveLabel?: string
  className?: string
  ariaLabel?: string
}

const stepStatusLabel: Record<ActionPlanStepStatus, string> = {
  pending: "Pending",
  running: "In progress",
  complete: "Completed",
  skipped: "Skipped",
  error: "Failed",
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

function moveStep(steps: ActionPlanStep[], from: number, to: number) {
  const next = [...steps]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function getHeaderLabel(status: ActionPlanStatus, steps: ActionPlanStep[]) {
  switch (status) {
    case "approved":
      return "Approved"
    case "running": {
      const done = steps.filter((step) => step.status === "complete").length
      return `Running · ${done} of ${steps.length}`
    }
    case "complete":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    default:
      return "Review before running"
  }
}

function StepMarker({
  index,
  status = "pending",
}: {
  index: number
  status?: ActionPlanStepStatus
}) {
  const base = "size-4 shrink-0"

  switch (status) {
    case "running":
      return (
        <Loader2
          aria-hidden="true"
          className={cn(base, "animate-spin text-accent-brand motion-reduce:animate-none")}
        />
      )
    case "complete":
      return <Check aria-hidden="true" className={cn(base, "text-green-600")} />
    case "error":
      return <CircleAlert aria-hidden="true" className={cn(base, "text-red-500")} />
    case "skipped":
      return <CircleSlash aria-hidden="true" className={cn(base, "text-muted-foreground")} />
    default:
      return (
        <span
          aria-hidden="true"
          className="flex size-5 items-center justify-center border border-border text-xs text-muted-foreground tabular-nums"
        >
          {index + 1}
        </span>
      )
  }
}

type EditingState = {
  id: string
  title: string
  description: string
  isNew: boolean
}

function ActionPlan({
  steps,
  onStepsChange,
  mode = "contractual",
  status = "draft",
  editable: editableProp,
  title = "Plan of action",
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onApprove,
  onRegenerate,
  onCancel,
  approveLabel = "Run plan",
  className,
  ariaLabel = "Action plan",
}: ActionPlanProps) {
  const baseId = useId()
  const contentId = `${baseId}-content`
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [editing, setEditing] = useState<EditingState | null>(null)
  const [lifted, setLifted] = useState<{
    id: string
    original: ActionPlanStep[]
  } | null>(null)
  const [draggableId, setDraggableId] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const pendingFocusId = useRef<string | null>(null)

  const isOpen = openProp ?? internalOpen
  const isDraft = mode === "contractual" && status === "draft"
  const editable = Boolean(onStepsChange) && (editableProp ?? isDraft)
  const dragFrom = dragId ? steps.findIndex((step) => step.id === dragId) : -1

  const handleId = (id: string) => `${baseId}-handle-${id}`
  const editId = (id: string) => `${baseId}-edit-${id}`
  const addId = `${baseId}-add`

  // Reordering moves DOM nodes, which drops focus; restore it after render.
  useEffect(() => {
    if (!pendingFocusId.current) return
    document.getElementById(pendingFocusId.current)?.focus()
    pendingFocusId.current = null
  })

  function toggle() {
    const next = !isOpen
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function updateSteps(next: ActionPlanStep[]) {
    onStepsChange?.(next)
  }

  function startEdit(step: ActionPlanStep) {
    setLifted(null)
    setEditing({
      id: step.id,
      title: step.title,
      description: step.description ?? "",
      isNew: false,
    })
  }

  function saveEdit() {
    if (!editing || !editing.title.trim()) return
    updateSteps(
      steps.map((step) =>
        step.id === editing.id
          ? {
              ...step,
              title: editing.title.trim(),
              description: editing.description.trim() || undefined,
            }
          : step
      )
    )
    pendingFocusId.current = editId(editing.id)
    setEditing(null)
  }

  function cancelEdit() {
    if (!editing) return
    if (editing.isNew) {
      updateSteps(steps.filter((step) => step.id !== editing.id))
      pendingFocusId.current = addId
    } else {
      pendingFocusId.current = editId(editing.id)
    }
    setEditing(null)
  }

  function addStep() {
    const id = crypto.randomUUID()
    setLifted(null)
    updateSteps([...steps, { id, title: "" }])
    setEditing({ id, title: "", description: "", isNew: true })
  }

  function removeStep(index: number) {
    const removed = steps[index]
    const neighbour = steps[index + 1] ?? steps[index - 1]
    updateSteps(steps.filter((step) => step.id !== removed.id))
    pendingFocusId.current = neighbour ? editId(neighbour.id) : addId
    setAnnouncement(`Removed step: ${removed.title}`)
  }

  function handleGripKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    step: ActionPlanStep
  ) {
    const isLifted = lifted?.id === step.id

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      if (isLifted) {
        setLifted(null)
        setAnnouncement(`${step.title} dropped at position ${index + 1} of ${steps.length}`)
      } else {
        setLifted({ id: step.id, original: steps })
        setAnnouncement(
          `${step.title} picked up at position ${index + 1} of ${steps.length}. Use the arrow keys to move, Space to drop, Escape to cancel.`
        )
      }
      return
    }

    if (!isLifted) return

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault()
      const to = index + (event.key === "ArrowUp" ? -1 : 1)
      if (to < 0 || to >= steps.length) return
      updateSteps(moveStep(steps, index, to))
      pendingFocusId.current = handleId(step.id)
      setAnnouncement(`${step.title} moved to position ${to + 1} of ${steps.length}`)
    } else if (event.key === "Escape") {
      event.preventDefault()
      updateSteps(lifted.original)
      pendingFocusId.current = handleId(step.id)
      setLifted(null)
      setAnnouncement(`Reorder cancelled. ${step.title} returned to its original position.`)
    }
  }

  function handleDragStart(event: DragEvent<HTMLLIElement>, step: ActionPlanStep) {
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", step.id)
    setLifted(null)
    setDragId(step.id)
  }

  function handleDragOver(event: DragEvent<HTMLLIElement>, index: number) {
    if (!dragId) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    const rect = event.currentTarget.getBoundingClientRect()
    const after = event.clientY > rect.top + rect.height / 2
    setDropIndex(after ? index + 1 : index)
  }

  function handleDrop(event: DragEvent<HTMLLIElement>) {
    event.preventDefault()
    if (dragFrom >= 0 && dropIndex !== null) {
      const to = dropIndex > dragFrom ? dropIndex - 1 : dropIndex
      if (to !== dragFrom) {
        const step = steps[dragFrom]
        updateSteps(moveStep(steps, dragFrom, to))
        setAnnouncement(`${step.title} moved to position ${to + 1} of ${steps.length}`)
      }
    }
    endDrag()
  }

  function endDrag() {
    setDragId(null)
    setDropIndex(null)
    setDraggableId(null)
  }

  const showDropIndicator = (index: number) =>
    dropIndex === index && dragFrom >= 0 && index !== dragFrom && index !== dragFrom + 1

  const headerLabel = getHeaderLabel(status, steps)
  const showFooter = isDraft && (onApprove || onRegenerate || onCancel)

  return (
    <section
      aria-label={ariaLabel}
      data-slot="action-plan"
      data-mode={mode}
      data-status={status}
      className={cn(
        "w-full bg-card text-sm text-card-foreground ring-1 ring-foreground/10",
        className
      )}
    >
      <div data-slot="action-plan-header" className="transition-colors hover:bg-muted/50">
        <button
          aria-controls={contentId}
          aria-expanded={isOpen}
          data-slot="action-plan-trigger"
          className="flex min-h-11 w-full min-w-0 items-center gap-2 px-4 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          type="button"
          onClick={toggle}
        >
          <ListChecks aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span data-slot="action-plan-title" className="shrink-0 font-medium">
            {title}
          </span>
          <span className="min-w-0 truncate text-muted-foreground">{headerLabel}</span>
          {steps.length > 0 && status !== "running" && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {steps.length} {steps.length === 1 ? "step" : "steps"}
            </span>
          )}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-accent-brand transition-transform motion-reduce:transition-none",
              status === "running" && "ml-auto",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      <div
        data-slot="action-plan-content"
        hidden={!isOpen}
        id={contentId}
        className="border-t border-border px-4 py-4 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
      >
        <ol data-slot="action-plan-step-list" className="flex flex-col">
          {steps.map((step, index) => {
            const KindIcon = step.kind ? kindIcon[step.kind] : null
            const isEditing = editing?.id === step.id
            const isLifted = lifted?.id === step.id

            return (
              <li
                key={step.id}
                data-slot="action-plan-step"
                data-status={step.status ?? "pending"}
                data-dragging={dragId === step.id || undefined}
                data-lifted={isLifted || undefined}
                draggable={draggableId === step.id}
                className={cn(
                  "relative flex gap-3 border-t border-transparent py-2 data-dragging:opacity-50 data-lifted:bg-muted",
                  showDropIndicator(index) && "border-t-accent-brand",
                  index === steps.length - 1 &&
                    showDropIndicator(steps.length) &&
                    "border-b border-b-accent-brand"
                )}
                onDragEnd={endDrag}
                onDragOver={(event) => handleDragOver(event, index)}
                onDragStart={(event) => handleDragStart(event, step)}
                onDrop={handleDrop}
              >
                {editable && !isEditing && (
                  <button
                    aria-label={`Reorder step ${index + 1}: ${step.title}`}
                    aria-pressed={isLifted}
                    data-slot="action-plan-step-handle"
                    className="-ml-1 flex h-5 w-4 shrink-0 cursor-grab items-center justify-center text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing aria-pressed:text-accent-brand"
                    id={handleId(step.id)}
                    type="button"
                    onKeyDown={(event) => handleGripKeyDown(event, index, step)}
                    onPointerDown={() => setDraggableId(step.id)}
                    onPointerUp={() => setDraggableId(null)}
                  >
                    <GripVertical aria-hidden="true" className="size-4" />
                  </button>
                )}
                <span className="flex size-5 shrink-0 items-center justify-center">
                  <StepMarker index={index} status={step.status} />
                </span>

                <div className="min-w-0 flex-1">
                  <span className="sr-only">
                    Step {index + 1}
                    {step.status ? `, ${stepStatusLabel[step.status]}` : ""}:{" "}
                  </span>
                  {isEditing && editing ? (
                    <div data-slot="action-plan-step-edit" className="flex flex-col gap-2">
                      <Textarea
                        aria-label={`Step ${index + 1} title`}
                        autoFocus
                        className="min-h-0"
                        placeholder="Describe the step"
                        rows={1}
                        value={editing.title}
                        onChange={(event) =>
                          setEditing({ ...editing, title: event.target.value })
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault()
                            saveEdit()
                          } else if (event.key === "Escape") {
                            event.preventDefault()
                            cancelEdit()
                          }
                        }}
                      />
                      <Textarea
                        aria-label={`Step ${index + 1} details`}
                        className="min-h-0"
                        placeholder="Add details (optional)"
                        rows={2}
                        value={editing.description}
                        onChange={(event) =>
                          setEditing({ ...editing, description: event.target.value })
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault()
                            cancelEdit()
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          disabled={!editing.title.trim()}
                          size="xs"
                          type="button"
                          onClick={saveEdit}
                        >
                          <Check aria-hidden="true" />
                          Save
                        </Button>
                        <Button size="xs" type="button" variant="tertiary" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex min-h-5 items-center gap-2">
                        <span
                          className={cn(
                            "min-w-0 font-medium",
                            step.status === "skipped" && "text-muted-foreground line-through",
                            step.status === "pending" && status !== "draft" && "text-muted-foreground"
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
                        {editable && (
                          <span className="ml-auto flex shrink-0 gap-1">
                            <Button
                              aria-label={`Edit step ${index + 1}`}
                              id={editId(step.id)}
                              size="icon-xs"
                              type="button"
                              variant="tertiary"
                              onClick={() => startEdit(step)}
                            >
                              <Pencil aria-hidden="true" />
                            </Button>
                            <Button
                              aria-label={`Remove step ${index + 1}`}
                              size="icon-xs"
                              type="button"
                              variant="tertiary"
                              onClick={() => removeStep(index)}
                            >
                              <Trash2 aria-hidden="true" />
                            </Button>
                          </span>
                        )}
                      </div>
                      {step.description && (
                        <p className="mt-0.5 text-muted-foreground">{step.description}</p>
                      )}
                      {step.detail && (
                        <details className="group/detail mt-1">
                          <summary className="flex w-fit cursor-pointer list-none items-center gap-1 text-xs text-muted-foreground outline-none marker:hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                            Details
                            <ChevronDown
                              aria-hidden="true"
                              className="size-3 transition-transform group-open/detail:rotate-180 motion-reduce:transition-none"
                            />
                          </summary>
                          <div className="mt-2 bg-muted p-3 text-xs">{step.detail}</div>
                        </details>
                      )}
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {steps.length === 0 && (
          <p className="text-muted-foreground">No steps yet.</p>
        )}

        {editable && (
          <Button
            className="mt-2"
            disabled={editing !== null}
            id={addId}
            size="sm"
            type="button"
            variant="tertiary"
            onClick={addStep}
          >
            <Plus aria-hidden="true" />
            Add step
          </Button>
        )}

        <span aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </div>

      {showFooter && (
        <div
          data-slot="action-plan-footer"
          className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3"
        >
          {onApprove && (
            <Button
              disabled={editing !== null || lifted !== null || steps.length === 0}
              size="sm"
              type="button"
              onClick={() => onApprove(steps)}
            >
              <Play aria-hidden="true" />
              {approveLabel}
            </Button>
          )}
          {onRegenerate && (
            <Button size="sm" type="button" variant="outline" onClick={onRegenerate}>
              <RotateCcw aria-hidden="true" />
              Regenerate
            </Button>
          )}
          {onCancel && (
            <Button
              className="ml-auto"
              size="sm"
              type="button"
              variant="tertiary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </section>
  )
}

export { ActionPlan }

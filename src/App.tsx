import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronRight, FileText, Lightbulb, PenLine } from "lucide-react"

import {
  ActionPlan,
  type ActionPlanMode,
  type ActionPlanStatus,
  type ActionPlanStep,
  type ActionPlanStepStatus,
} from "@/components/xds/action-plan"
import { Button } from "@/components/xds/button"
import {
  ConfirmationPrompt,
  type ConfirmationPromptStatus,
} from "@/components/xds/confirmation-prompt"
import {
  CapabilityIntro,
  type CapabilityIntroStartersLayout,
  type CapabilityItem,
} from "@/components/xds/capability-intro"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/xds/card"
import {
  Sources,
  CitationReference,
  type CitationItem,
} from "@/components/xds/citations"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/xds/dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/xds/sheet"
import {
  INITIAL_CTA_ATTACHMENT_ACCEPT,
  InitialCta,
  isSupportedInitialCtaAttachment,
  type InitialCtaSubmitPayload,
} from "@/components/xds/initial-cta"
import {
  Suggestions,
  type SuggestionItem,
} from "@/components/xds/suggestions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/xds/select"
import { Textarea } from "@/components/xds/textarea"
import { LimitationNotice } from "@/components/xds/limitation-notice"
import {
  PrivacyNotice,
  type PrivacyNoticeItem,
  type PrivacyNoticeVariant,
} from "@/components/xds/privacy-notice"
import {
  ToolResult,
  type ToolResultStatus,
} from "@/components/xds/tool-result"
import {
  ResponseStatus,
  type ResponseActivity,
} from "@/components/xds/response-status"
import { AssistantHomeExample } from "@/examples/assistant-home-example"
import { ChatbotExample } from "@/examples/chatbot-example"
import {
  StreamOfThought,
  type StreamOfThoughtStatus,
  type ThoughtStep,
} from "@/components/xds/stream-of-thought"

type ComponentExample = {
  description: string
  code: string | ((props: ComponentExampleCodeProps) => string)
  preview: (props: ComponentExamplePreviewProps) => ReactNode
}

type SuggestionsPlacement = "above" | "below"

type NavItem = {
  id: string
  name: string
  example?: ComponentExample
}

type ComponentExampleCodeProps = {
  suggestionsPlacement: SuggestionsPlacement
  showSuggestionsLabel: boolean
}

type ComponentExamplePreviewProps = ComponentExampleCodeProps & {
  onSuggestionsPlacementChange: (placement: SuggestionsPlacement) => void
  onShowSuggestionsLabelChange: (showLabel: boolean) => void
}

const starterSuggestions: SuggestionItem[] = [
  {
    label: "Summarize a document",
    prompt: "Summarize the key points and decisions in this document.",
  },
  {
    label: "Draft an outline",
    prompt: "Create a clear outline for a short presentation about...",
  },
  {
    label: "Explain a concept",
    prompt: "Explain this concept in simple terms, with an example.",
  },
]

function InitialCtaPreview({
  suggestionsPlacement,
  onSuggestionsPlacementChange,
  showSuggestionsLabel,
  onShowSuggestionsLabelChange,
}: ComponentExamplePreviewProps) {
  const [prompt, setPrompt] = useState("")
  const [mode, setMode] = useState("assistant")
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentError, setAttachmentError] = useState("")
  const [feedback, setFeedback] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(payload: InitialCtaSubmitPayload) {
    setFeedback(
      `Ready to ${payload.mode ?? "create"}${payload.templateId ? ` with ${payload.templateId}` : ""}: ${payload.prompt}${payload.attachments.length > 0 ? ` (${payload.attachments.length} file${payload.attachments.length === 1 ? "" : "s"} attached)` : ""}`
    )
  }

  const suggestionList = (
    <div className="space-y-2">
      {showSuggestionsLabel && (
        <p className="text-sm font-medium text-muted-foreground">
          Try one of these
        </p>
      )}
      <Suggestions
        ariaLabel={showSuggestionsLabel ? "Try one of these" : "Prompt suggestions"}
        items={starterSuggestions}
        onSelect={setPrompt}
      />
    </div>
  )

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Suggestions:
          </span>
          <div
            aria-label="Suggestion placement"
            className="flex border border-border bg-muted p-0.5"
            role="group"
          >
            {(["above", "below"] as const).map((placement) => (
              <Button
                key={placement}
                aria-pressed={placement === suggestionsPlacement}
                className="border-0"
                size="xs"
                type="button"
                variant={
                  placement === suggestionsPlacement ? "secondary" : "tertiary"
                }
                onClick={() => onSuggestionsPlacementChange(placement)}
              >
                {placement === "above" ? "Above CTA" : "Below CTA"}
              </Button>
            ))}
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            checked={showSuggestionsLabel}
            className="size-4 accent-primary"
            type="checkbox"
            onChange={(event) =>
              onShowSuggestionsLabelChange(event.target.checked)
            }
          />
          Show "Try one of these"
        </label>
      </div>

      <div className="space-y-4">
        <input
          ref={fileInputRef}
          accept={INITIAL_CTA_ATTACHMENT_ACCEPT}
          className="sr-only"
          multiple
          type="file"
          onChange={(event) => {
            const selectedFiles = Array.from(event.target.files ?? [])
            const acceptedFiles = selectedFiles.filter(
              isSupportedInitialCtaAttachment
            )
            const rejectedFiles = selectedFiles.filter(
              (file) => !isSupportedInitialCtaAttachment(file)
            )

            setAttachments((current) =>
              [...current, ...acceptedFiles].filter(
                (file, index, allFiles) =>
                  allFiles.findIndex(
                    (item) =>
                      item.name === file.name &&
                      item.size === file.size &&
                      item.lastModified === file.lastModified
                  ) === index
              )
            )
            setAttachmentError(
              rejectedFiles.length > 0
                ? `Only PDF, DOCX, XLSX, PNG, and JPG files can be attached. Rejected: ${rejectedFiles.map((file) => file.name).join(", ")}.`
                : ""
            )
            event.target.value = ""
          }}
        />
        {suggestionsPlacement === "above" && suggestionList}
        <InitialCta
          variant="chat"
          title="Ask a question"
          placeholder="Ask a question..."
          mode={mode}
          modes={[
            { value: "assistant", label: "Assistant" },
            { value: "novartis-chat", label: "Novartis Chat" },
          ]}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          attachmentError={attachmentError}
          onAttachmentErrorDismiss={() => setAttachmentError("")}
          onAttach={() => fileInputRef.current?.click()}
          onVoiceInput={() => setFeedback("Voice input is ready.")}
          onModeChange={setMode}
          onSubmit={handleSubmit}
          onValueChange={setPrompt}
          value={prompt}
        />
        {suggestionsPlacement === "below" && suggestionList}
        {feedback && (
          <p className="text-sm text-muted-foreground" role="status">
            {feedback}
          </p>
        )}
      </div>
    </div>
  )
}

function SuggestionsPreview() {
  const [prompt, setPrompt] = useState("")
  const [showLabel, setShowLabel] = useState(true)
  const [feedback, setFeedback] = useState("")

  return (
    <div className="w-full max-w-3xl space-y-4">
      <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <input
          checked={showLabel}
          className="size-4 accent-primary"
          type="checkbox"
          onChange={(event) => setShowLabel(event.target.checked)}
        />
        Show "Try one of these"
      </label>
      <InitialCta
        variant="chat"
        title="Ask a question"
        placeholder="Choose a suggestion or write your own..."
        value={prompt}
        onValueChange={setPrompt}
        onSubmit={({ prompt: submittedPrompt }) =>
          setFeedback(`Ready to submit: ${submittedPrompt}`)
        }
      />
      {feedback && (
        <p className="text-sm text-muted-foreground" role="status">
          {feedback}
        </p>
      )}
      <div className="space-y-2">
        {showLabel && (
          <p className="text-sm font-medium text-muted-foreground">
            Try one of these
          </p>
        )}
        <Suggestions
          ariaLabel={showLabel ? "Try one of these" : "Prompt suggestions"}
          items={starterSuggestions}
          onSelect={setPrompt}
        />
      </div>
    </div>
  )
}

const previewCapabilities: CapabilityItem[] = [
  {
    id: "summarize",
    title: "Summarize documents",
    description: "Pull out key points, decisions, and open questions.",
    icon: <FileText />,
    starters: [starterSuggestions[0]],
  },
  {
    id: "draft",
    title: "Draft content",
    description: "Write outlines, emails, and first drafts.",
    icon: <PenLine />,
    starters: [starterSuggestions[1]],
  },
  {
    id: "explain",
    title: "Explain concepts",
    description: "Get plain-language explanations with examples.",
    icon: <Lightbulb />,
    starters: [starterSuggestions[2]],
  },
]

function CapabilityIntroPreview() {
  const [prompt, setPrompt] = useState("")
  const [layout, setLayout] = useState<CapabilityIntroStartersLayout>("flat")
  const [feedback, setFeedback] = useState("")

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div
        aria-label="Starters layout"
        className="flex gap-2"
        role="group"
      >
        {(["flat", "grouped"] as const).map((option) => (
          <Button
            key={option}
            aria-pressed={layout === option}
            size="sm"
            type="button"
            variant={layout === option ? "primary" : "outline"}
            onClick={() => setLayout(option)}
          >
            {option === "flat" ? "Flat starters" : "Grouped starters"}
          </Button>
        ))}
      </div>
      <CapabilityIntro
        title="How can I help today?"
        description="I can help you find, write, and explain information for your work."
        capabilities={previewCapabilities}
        startersLayout={layout}
        onSelectStarter={setPrompt}
      >
        <div className="space-y-2">
          <InitialCta
            variant="chat"
            title="Ask a question"
            placeholder="Choose a starter or write your own..."
            disclaimer="AI can make mistakes. Verify important information before relying on it."
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={({ prompt: submittedPrompt }) =>
              setFeedback(`Ready to submit: ${submittedPrompt}`)
            }
          />
          {feedback && (
            <p className="text-sm text-muted-foreground" role="status">
              {feedback}
            </p>
          )}
        </div>
      </CapabilityIntro>
    </div>
  )
}

function SelectPreview() {
  const [mode, setMode] = useState("quick")
  const modes = [
    { value: "quick", label: "Quick" },
    { value: "deep", label: "Deep" },
  ]

  return (
    <Select
      value={mode}
      onValueChange={(nextMode) => {
        if (nextMode) setMode(nextMode)
      }}
    >
      <SelectTrigger aria-label="Response mode" className="min-w-36">
        <SelectValue>
          {modes.find((item) => item.value === mode)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {modes.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function TextareaPreview() {
  const [value, setValue] = useState("")

  return (
    <Textarea
      aria-label="Example text"
      className="min-h-40 max-w-xl"
      placeholder="Write a few lines..."
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  )
}

const exampleCitations: CitationItem[] = [
  {
    id: "risk-framework",
    title: "AI Risk Management Framework",
    source: "National Institute of Standards and Technology",
    href: "https://www.nist.gov/itl/ai-risk-management-framework",
    locator: "AI RMF 1.0",
  },
  {
    id: "deployment-checklist",
    title: "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile",
    source: "National Institute of Standards and Technology",
    href: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf",
    locator: "NIST AI 600-1",
  },
]

function SourcesPreview() {
  return (
    <Sources
      ariaLabel="Sources"
      className="w-full max-w-2xl"
      items={exampleCitations}
    >
      <p>
        Risk reviews should continue as the system and its operating context
        evolve<CitationReference citationId="risk-framework" />. Generative AI
        systems also have dedicated risk considerations
        <CitationReference citationId="deployment-checklist" />.
      </p>
    </Sources>
  )
}

function DialogPreview() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>
            Review this action before continuing.
          </DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground">Dialog content goes here.</p>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type DemoStep = Omit<ThoughtStep, "status"> & { duration: number }

const demoSteps: DemoStep[] = [
  {
    id: "plan",
    title: "Understanding the request",
    kind: "reasoning",
    description:
      "The user wants a short risk summary for a generative AI deployment.",
    duration: 2,
  },
  {
    id: "search",
    title: "Searching for risk frameworks",
    kind: "search",
    detail: { input: 'query: "generative AI risk management framework"' },
    sources: exampleCitations,
    duration: 4,
  },
  {
    id: "extract",
    title: "Extracting key controls",
    kind: "tool",
    detail: {
      input: '{ "document": "NIST.AI.600-1.pdf", "sections": ["2", "3"] }',
      output: '{ "controls": 12, "categories": ["Govern", "Map", "Measure", "Manage"] }',
    },
    duration: 3,
  },
  {
    id: "export",
    title: "Save summary to shared workspace",
    kind: "code",
    description: "Writing to a shared location requires your approval.",
    detail: {
      language: "python",
      code: 'workspace.save("risk-summary.md", summary)',
    },
    duration: 1,
  },
  {
    id: "compose",
    title: "Composing the answer",
    kind: "reasoning",
    duration: 2,
  },
]

const errorStepIndex = 2
const approvalStepIndex = 3

function StreamOfThoughtPreview() {
  const prompt =
    "Summarize the key risks of deploying generative AI and save it to our shared workspace."
  const [phase, setPhase] = useState(0)
  const [simulateError, setSimulateError] = useState(false)
  const [requireApproval, setRequireApproval] = useState(true)
  const [failed, setFailed] = useState(false)
  const [retried, setRetried] = useState(false)
  const [approved, setApproved] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [runId, setRunId] = useState(0)

  const done = phase >= demoSteps.length
  const waiting =
    requireApproval && phase === approvalStepIndex && !approved && !stopped
  const status: StreamOfThoughtStatus = done
    ? "complete"
    : stopped
      ? "stopped"
      : failed
        ? "error"
        : waiting
          ? "waiting"
          : "thinking"

  const steps: ThoughtStep[] = demoSteps.map((step, index) => ({
    ...step,
    retried: index === errorStepIndex && retried,
    status:
      index < phase
        ? "complete"
        : index > phase || stopped
          ? "queued"
          : failed
            ? "error"
            : waiting
              ? "waiting"
              : "running",
  }))

  useEffect(() => {
    if (status !== "thinking") return
    const timer = window.setTimeout(() => {
      if (phase === errorStepIndex && simulateError && !retried) {
        setFailed(true)
      } else {
        setPhase((current) => current + 1)
      }
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [status, phase, simulateError, retried])

  function restart() {
    setPhase(0)
    setFailed(false)
    setRetried(false)
    setApproved(false)
    setStopped(false)
    setRunId((current) => current + 1)
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            checked={simulateError}
            className="size-4 accent-primary"
            type="checkbox"
            onChange={(event) => setSimulateError(event.target.checked)}
          />
          Simulate a tool error
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            checked={requireApproval}
            className="size-4 accent-primary"
            type="checkbox"
            onChange={(event) => setRequireApproval(event.target.checked)}
          />
          Require user approval
        </label>
        <Button size="sm" type="button" variant="outline" onClick={restart}>
          Restart run
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <p className="max-w-[80%] self-end bg-muted px-4 py-2 text-sm">
          {prompt}
        </p>
        <StreamOfThought
          key={runId}
          duration={demoSteps
            .slice(0, phase)
            .reduce((total, step) => total + step.duration, 0)}
          status={status}
          steps={steps}
          onApprove={() => setApproved(true)}
          onReject={() => setStopped(true)}
          onRetry={() => {
            setFailed(false)
            setRetried(true)
          }}
          onStop={() => setStopped(true)}
        />
        {status === "complete" && (
          <p className="text-sm leading-relaxed">
            Generative AI deployments should be governed across four
            functions: Govern, Map, Measure, and Manage. I found 12 relevant
            controls and saved a summary to your shared workspace.
          </p>
        )}
        {status === "stopped" && (
          <p className="text-sm text-muted-foreground">
            Run stopped. Restart the demo to try again.
          </p>
        )}
      </div>
    </div>
  )
}

const responseActivities: ResponseActivity[] = [
  "reasoning",
  "search",
  "read",
  "tool",
  "drafting",
]

function ResponseStatusPreview() {
  const [index, setIndex] = useState(0)
  const [stopped, setStopped] = useState(false)

  const status: StreamOfThoughtStatus =
    index >= responseActivities.length
      ? "complete"
      : stopped
        ? "stopped"
        : "thinking"
  const activity =
    responseActivities[Math.min(index, responseActivities.length - 1)]

  useEffect(() => {
    if (status !== "thinking") return
    const timer = window.setTimeout(
      () => setIndex((current) => current + 1),
      1400
    )
    return () => window.clearTimeout(timer)
  }, [status, index])

  function restart() {
    setIndex(0)
    setStopped(false)
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button size="sm" type="button" variant="outline" onClick={restart}>
            Restart run
          </Button>
        </div>
        <p className="max-w-[80%] self-end bg-muted px-4 py-2 text-sm">
          What changed in our travel policy this quarter?
        </p>
        <ResponseStatus
          activity={activity}
          elapsed={index * 1.4}
          status={status}
          onStop={() => setStopped(true)}
        />
        {status === "complete" && (
          <p className="text-sm leading-relaxed">
            Two changes took effect this quarter: economy class is now required
            for flights under six hours, and hotel bookings must go through the
            approved booking tool.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Other states</p>
        <ResponseStatus status="waiting" />
        <ResponseStatus status="error" />
        <ResponseStatus status="stopped" />
      </div>
    </div>
  )
}

const initialPlanSteps: ActionPlanStep[] = [
  {
    id: "metrics",
    title: "Gather Q3 adoption metrics",
    description: "Pull active users and usage by team from the analytics workspace.",
    kind: "read",
  },
  {
    id: "trends",
    title: "Identify key trends",
    description: "Compare Q3 with Q2 and flag the three biggest shifts.",
    kind: "reasoning",
  },
  {
    id: "outline",
    title: "Draft a 5-slide outline",
    kind: "reasoning",
  },
  {
    id: "charts",
    title: "Generate charts",
    kind: "code",
    detail: "Bar chart of weekly active users by team; line chart of prompts per user.",
  },
  {
    id: "deck",
    title: "Build the presentation",
    description: "Saves the deck to your shared drive.",
    kind: "tool",
  },
]

function ActionPlanPreview() {
  const prompt = "Create a 5-slide deck summarizing Q3 AI adoption for leadership."
  const [mode, setMode] = useState<ActionPlanMode>("contractual")
  const [planSteps, setPlanSteps] = useState(initialPlanSteps)
  const [planStatus, setPlanStatus] = useState<ActionPlanStatus>("draft")
  const [phase, setPhase] = useState(0)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (planStatus !== "running") return
    const timer = window.setTimeout(() => {
      if (phase + 1 >= planSteps.length) setPlanStatus("complete")
      setPhase(phase + 1)
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [planStatus, phase, planSteps.length])

  function restart(nextMode: ActionPlanMode = mode) {
    setMode(nextMode)
    setPlanSteps(initialPlanSteps)
    setPlanStatus(nextMode === "advisory" ? "running" : "draft")
    setPhase(0)
    setRunId((current) => current + 1)
  }

  function getStepStatus(index: number): ActionPlanStepStatus | undefined {
    if (planStatus === "draft") return undefined
    if (index < phase) return "complete"
    if (planStatus === "cancelled") return "skipped"
    if (index === phase && planStatus === "running") return "running"
    return "pending"
  }

  const steps = planSteps.map((step, index) => ({
    ...step,
    status: getStepStatus(index),
  }))

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            checked={mode === "contractual"}
            className="size-4 accent-primary"
            type="checkbox"
            onChange={(event) =>
              restart(event.target.checked ? "contractual" : "advisory")
            }
          />
          Require approval before running
        </label>
        <Button size="sm" type="button" variant="outline" onClick={() => restart()}>
          Restart demo
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <p className="max-w-[80%] self-end bg-muted px-4 py-2 text-sm">
          {prompt}
        </p>
        <ActionPlan
          key={runId}
          mode={mode}
          status={planStatus}
          steps={steps}
          onApprove={() => setPlanStatus("running")}
          onCancel={() => setPlanStatus("cancelled")}
          onRegenerate={() => setPlanSteps(initialPlanSteps)}
          onStepsChange={setPlanSteps}
        />
        {planStatus === "complete" && (
          <p className="text-sm leading-relaxed">
            Your 5-slide Q3 AI adoption deck is ready in the shared drive.
          </p>
        )}
        {planStatus === "cancelled" && (
          <p className="text-sm text-muted-foreground">
            Plan cancelled. Restart the demo to try again.
          </p>
        )}
      </div>
    </div>
  )
}

function ToolResultPreview() {
  const [saveStatus, setSaveStatus] = useState<ToolResultStatus>("running")
  const [emailStatus, setEmailStatus] = useState<ToolResultStatus>("error")
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (saveStatus !== "running") return
    const timer = window.setTimeout(() => setSaveStatus("success"), 1500)
    return () => window.clearTimeout(timer)
  }, [saveStatus, runId])

  useEffect(() => {
    if (emailStatus !== "running") return
    const timer = window.setTimeout(() => setEmailStatus("success"), 1500)
    return () => window.clearTimeout(timer)
  }, [emailStatus])

  function restart() {
    setSaveStatus("running")
    setEmailStatus("error")
    setRunId((current) => current + 1)
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" type="button" variant="outline" onClick={restart}>
          Restart demo
        </Button>
      </div>
      <ToolResult
        key={`save-${runId}`}
        duration={2}
        status={saveStatus}
        title={
          saveStatus === "cancelled"
            ? "Save undone"
            : saveStatus === "running"
              ? "Saving notes to your workspace"
              : "Saved notes to your workspace"
        }
        tool="Workspace · save_file"
        summary={
          saveStatus === "cancelled" ? "notes.md was removed" : "notes.md · 1.2 KB"
        }
        fields={[
          { label: "File", value: "notes.md" },
          { label: "Location", value: "Team workspace / AI pilot" },
        ]}
        detail={{
          input: '{ "path": "AI pilot/notes.md", "overwrite": false }',
          output: '{ "saved": true, "bytes": 1214 }',
        }}
        onUndo={() => setSaveStatus("cancelled")}
      />
      <ToolResult
        key={`email-${runId}`}
        duration={emailStatus === "error" ? 30 : 3}
        status={emailStatus}
        title={
          emailStatus === "success"
            ? "Sent summary to 3 recipients"
            : emailStatus === "running"
              ? "Sending summary"
              : "Couldn't send summary"
        }
        tool="Mail · send"
        summary={
          emailStatus === "error"
            ? "The mail service timed out"
            : "Subject: Q3 AI adoption summary"
        }
        fields={[
          { label: "To", value: "leadership-team@example.com" },
          { label: "Subject", value: "Q3 AI adoption summary" },
        ]}
        detail={{
          output:
            emailStatus === "error"
              ? '{ "error": "ETIMEDOUT", "retryable": true }'
              : '{ "delivered": 3 }',
        }}
        onRetry={() => setEmailStatus("running")}
      />
      <ToolResult
        duration={1}
        status="success"
        title="Created a calendar event"
        tool="Calendar · create_event"
        summary="Tue 10:00–10:30 · AI pilot review"
      />
    </div>
  )
}

type ConfirmationScenario = "send" | "delete"

function ConfirmationPromptPreview() {
  const [scenario, setScenario] = useState<ConfirmationScenario>("send")
  const [status, setStatus] = useState<ConfirmationPromptStatus>("pending")
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (status !== "confirming") return
    const timer = window.setTimeout(
      () => setStatus(simulateFailure ? "error" : "confirmed"),
      1200
    )
    return () => window.clearTimeout(timer)
  }, [status, simulateFailure])

  function restart(nextScenario: ConfirmationScenario = scenario) {
    setScenario(nextScenario)
    setStatus("pending")
    setNotice("")
  }

  const isSend = scenario === "send"

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div aria-label="Scenario" className="flex gap-2" role="group">
          {(
            [
              { value: "send", label: "Send email" },
              { value: "delete", label: "Delete files" },
            ] as const
          ).map((option) => (
            <Button
              key={option.value}
              aria-pressed={scenario === option.value}
              size="sm"
              type="button"
              variant={scenario === option.value ? "secondary" : "tertiary"}
              onClick={() => restart(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input
              checked={simulateFailure}
              className="size-4 accent-primary"
              type="checkbox"
              onChange={(event) => setSimulateFailure(event.target.checked)}
            />
            Simulate failure
          </label>
          <Button size="sm" type="button" variant="outline" onClick={() => restart()}>
            Restart demo
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="max-w-[80%] self-end bg-muted px-4 py-2 text-sm">
          {isSend
            ? "Email the Q3 summary to the leadership team."
            : "Delete last year's draft reports from the shared drive."}
        </p>
        {isSend ? (
          <ConfirmationPrompt
            key="send"
            confirmLabel="Send email"
            description="I've drafted the email below. It will be sent from your account."
            fields={[
              { label: "To", value: "leadership-team@example.com (12 people)" },
              { label: "Subject", value: "Q3 AI adoption summary" },
            ]}
            status={status}
            title="Send email to Leadership team"
            onCancel={() => setStatus("cancelled")}
            onConfirm={() => setStatus("confirming")}
            onEdit={() => setNotice("Edit returns the request to the composer.")}
          >
            <p>
              Hi all, here is a short summary of Q3 AI adoption: weekly active
              users grew 18%, and three teams moved from pilot to rollout.
            </p>
          </ConfirmationPrompt>
        ) : (
          <ConfirmationPrompt
            key="delete"
            confirmLabel="Delete 14 files"
            description="These files haven't been opened in over 12 months."
            fields={[
              { label: "Location", value: "Shared drive / Reports / 2025 drafts" },
              { label: "Files", value: "14 files · 38 MB" },
            ]}
            intent="destructive"
            irreversible
            status={status}
            title="Delete 14 draft reports"
            onCancel={() => setStatus("cancelled")}
            onConfirm={() => setStatus("confirming")}
            onEdit={() => setNotice("Edit returns the request to the composer.")}
          />
        )}
        {notice && (
          <p className="text-sm text-muted-foreground" role="status">
            {notice}
          </p>
        )}
        {status === "confirmed" && (
          <p className="text-sm leading-relaxed">
            {isSend
              ? "Done. The summary was sent to 12 people."
              : "Done. 14 files were deleted."}
          </p>
        )}
        {status === "cancelled" && (
          <p className="text-sm text-muted-foreground">
            Okay, nothing was {isSend ? "sent" : "deleted"}.
          </p>
        )}
      </div>
    </div>
  )
}

function LimitationNoticePreview() {
  const [accessRequested, setAccessRequested] = useState(false)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={() => setAccessRequested(false)}
        >
          Restart demo
        </Button>
      </div>
      <p className="text-sm leading-relaxed">
        Weekly active users grew 18% in Q3, and three teams moved from pilot to
        rollout. Support tickets about the assistant fell by a third after the
        new onboarding guide was published.
      </p>
      <div className="flex flex-col gap-2">
        <LimitationNotice
          kind="stale"
          title="Usage figures are from the analytics export of 30 Sep 2026."
        />
        <LimitationNotice
          actionLabel={accessRequested ? undefined : "Request access"}
          kind="permission"
          title={
            accessRequested
              ? "Access to Finance SharePoint requested. Cost data will be included once it's granted."
              : "I couldn't access Finance SharePoint, so cost data isn't included."
          }
          onAction={() => setAccessRequested(true)}
        />
        <LimitationNotice
          kind="uncertain"
          title="Sources disagree on when the third team moved to rollout (August or September)."
        />
        <LimitationNotice
          kind="partial"
          title="Based on 3 of 5 team reports."
        >
          Two reports were password-protected PDFs and couldn't be read:
          Marketing Q3 review and Legal AI usage log.
        </LimitationNotice>
      </div>
    </div>
  )
}

const privacyItems: PrivacyNoticeItem[] = [
  {
    topic: "use",
    description:
      "Your prompts and files are used only to answer your request. They aren't used to train AI models.",
  },
  {
    topic: "retention",
    description:
      "Chats are kept for 30 days, then deleted. You can delete a chat at any time.",
  },
  {
    topic: "sharing",
    description:
      "Data stays within the company tenant. Web search sends only your search query to an external provider.",
  },
]

function PrivacyNoticePreview() {
  const [variant, setVariant] = useState<PrivacyNoticeVariant>("composer")
  const [prompt, setPrompt] = useState("")
  const [feedback, setFeedback] = useState("")

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div aria-label="Placement" className="flex gap-2" role="group">
        {(
          [
            { value: "composer", label: "Composer" },
            { value: "inline", label: "Inline" },
          ] as const
        ).map((option) => (
          <Button
            key={option.value}
            aria-pressed={variant === option.value}
            size="sm"
            type="button"
            variant={variant === option.value ? "primary" : "outline"}
            onClick={() => setVariant(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {variant === "composer" ? (
        <div className="space-y-2">
          <div>
            <InitialCta
              variant="chat"
              title="Ask a question"
              placeholder="Ask a question..."
              disclaimer=""
              submitLabel="Send"
              value={prompt}
              onValueChange={setPrompt}
              onSubmit={({ prompt: submitted }) => {
                setFeedback(`Ready to send: "${submitted}"`)
                setPrompt("")
              }}
            />
            <PrivacyNotice
              items={privacyItems}
              policyHref="#privacy-policy"
              title="AI can make mistakes. Chats are kept for 30 days and aren't used to train models."
            />
          </div>
          {feedback && (
            <p className="text-sm text-muted-foreground" role="status">
              {feedback}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="max-w-[80%] self-end bg-muted px-4 py-2 text-sm">
            What's the latest news on EU AI Act enforcement?
          </p>
          <PrivacyNotice
            variant="inline"
            items={[
              {
                topic: "sharing",
                description:
                  "Only the search query was sent to the web search provider. Your files and chat history stayed in the company tenant.",
              },
              {
                topic: "retention",
                description:
                  "The provider may keep search queries under its own retention policy.",
              },
            ]}
            policyHref="#privacy-policy"
            title="Your search query was sent to an external web search provider."
          />
          <p className="text-sm leading-relaxed">
            Placeholder answer: the first obligations under the EU AI Act now
            apply, and national authorities are setting up their enforcement
            teams. Most guidance so far focuses on prohibited practices and AI
            literacy.
          </p>
        </div>
      )}
    </div>
  )
}

const componentExamples: Record<string, ComponentExample> = {
  button: {
    description: "A control that triggers an action.",
    code: '<Button variant="primary">Button</Button>',
    preview: () => <Button>Button</Button>,
  },
  card: {
    description: "A flexible container for grouping related content and actions.",
    code: `<Card className="max-w-lg">
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Card description.</CardDescription>
  </CardHeader>
  <CardContent>Card content.</CardContent>
</Card>`,
    preview: () => (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description.</CardDescription>
        </CardHeader>
        <CardContent>Card content.</CardContent>
      </Card>
    ),
  },
  citations: {
    description:
      "Inline references connect generated claims to a scannable list of source material.",
    code: `const sources = [
  {
    id: "risk-framework",
    title: "AI Risk Management Framework",
    source: "National Institute of Standards and Technology",
    href: "https://www.nist.gov/itl/ai-risk-management-framework",
    locator: "AI RMF 1.0",
    excerpt: "The framework organizes risk management around Govern, Map, Measure, and Manage.",
  },
]

<Sources items={sources}>
  <p>
    Risk reviews should continue as systems evolve
    <CitationReference citationId="risk-framework" />.
  </p>
</Sources>`,
  preview: () => <SourcesPreview />,
  },
  dialog: {
    description: "A modal surface for focused tasks and important decisions.",
    code: `<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>
    Open dialog
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogDescription>Review before continuing.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    preview: () => <DialogPreview />,
  },
  select: {
    description: "A menu for choosing one option from a list.",
    code: `<Select value={mode} onValueChange={setMode}>
  <SelectTrigger aria-label="Response mode">
    <SelectValue placeholder="Choose a mode" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="quick">Quick</SelectItem>
    <SelectItem value="deep">Deep</SelectItem>
  </SelectContent>
</Select>`,
    preview: () => <SelectPreview />,
  },
  sheet: {
    description: "A panel that slides in from the edge of the screen to show secondary content.",
    code: `<Sheet>
  <SheetTrigger render={<Button />}>Open sheet</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Quick settings</SheetTitle>
      <SheetDescription>Manage your preferences.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <SheetClose render={<Button />}>Done</SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`,
    preview: () => (
      <Sheet>
        <SheetTrigger render={<Button />}>Open sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader className="pr-12">
            <SheetTitle>Quick settings</SheetTitle>
            <SheetDescription>Manage your preferences.</SheetDescription>
          </SheetHeader>
          <div className="px-4 text-muted-foreground">Sheet content.</div>
          <SheetFooter>
            <SheetClose render={<Button className="w-full" />}>Done</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  },
  textarea: {
    description: "A multi-line field for entering longer text.",
    code: `<Textarea
  value={value}
  onChange={(event) => setValue(event.target.value)}
  placeholder="Write a few lines..."
/>`,
    preview: () => <TextareaPreview />,
  },
  "initial-cta": {
    description: "A focused chat composer for starting an AI-assisted task.",
    code: ({ suggestionsPlacement, showSuggestionsLabel }) => {
      const otherPlacement = suggestionsPlacement === "above" ? "below" : "above"
      const heading = showSuggestionsLabel
        ? "{showSuggestionsLabel && <p>Try one of these</p>}"
        : "{/* Optional heading omitted */}"

      return `const suggestionList = (
  <>
    ${heading}
    <Suggestions
      items={suggestions}
      onSelect={setPrompt}
    />
  </>
)

<div className="space-y-4">
  {suggestionsPlacement === "${suggestionsPlacement}" && suggestionList}
  <InitialCta
    variant="chat"
    value={prompt}
    onValueChange={setPrompt}
    onSubmit={handleSubmit}
    modes={modes}
    mode={mode}
    onModeChange={setMode}
    onAttach={openAttachmentPicker}
    onVoiceInput={startVoiceInput}
  />
  {suggestionsPlacement === "${otherPlacement}" && suggestionList}
</div>`
    },
    preview: (props) => <InitialCtaPreview {...props} />,
  },
  suggestions: {
    description: "Prompt starters that help people discover what they can ask.",
    code: `const [prompt, setPrompt] = useState("")
const showLabel = true

<div className="space-y-4">
  <InitialCta
    variant="chat"
    title="Ask a question"
    value={prompt}
    onValueChange={setPrompt}
    onSubmit={handleSubmit}
  />
  {showLabel && <p>Try one of these</p>}
  <Suggestions
    items={suggestions}
    onSelect={setPrompt}
  />
</div>`,
    preview: () => <SuggestionsPreview />,
  },
  "capability-intro": {
    description:
      "An empty state that sets expectations: what the assistant can do, what it can't, and where to start.",
    code: `const capabilities: CapabilityItem[] = [
  {
    id: "summarize",
    title: "Summarize documents",
    description: "Pull out key points, decisions, and open questions.",
    icon: <FileText />,
    starters: [{ label: "Summarize a document", prompt: "Summarize..." }],
  },
]

<CapabilityIntro
  title="How can I help today?"
  description="I can help you find, write, and explain information."
  capabilities={capabilities}
  startersLayout="flat" // or "grouped"
  onSelectStarter={setPrompt}
>
  <InitialCta
    variant="chat"
    title="Ask a question"
    disclaimer="AI can make mistakes. Verify important information before relying on it."
    value={prompt}
    onValueChange={setPrompt}
    onSubmit={handleSubmit}
  />
</CapabilityIntro>`,
    preview: () => <CapabilityIntroPreview />,
  },
  "stream-of-thought": {
    description:
      "A visible trace of how the AI moves from request to answer: steps, tool calls, and evidence.",
    code: `const steps = [
  { id: "plan", title: "Understanding the request", kind: "reasoning", status: "complete" },
  {
    id: "search",
    title: "Searching for risk frameworks",
    kind: "search",
    status: "running",
    detail: { input: 'query: "generative AI risk"' },
    sources,
  },
  { id: "export", title: "Save summary", kind: "code", status: "queued" },
]

<StreamOfThought
  status="thinking"
  steps={steps}
  duration={12}
  onStop={stopRun}
  onApprove={approveStep}
  onReject={rejectStep}
  onRetry={retryStep}
/>`,
    preview: () => <StreamOfThoughtPreview />,
  },
  "response-status": {
    description:
      "A compact indicator for short waits, such as searching or drafting, when a full stream of thought would be too much.",
    code: `<ResponseStatus
  status="thinking" // thinking | waiting | error | stopped | complete (renders nothing)
  activity="search" // reasoning | search | read | tool | code | drafting
  elapsed={4}
  onStop={stopRun}
/>`,
    preview: () => <ResponseStatusPreview />,
  },
  "tool-result": {
    description:
      "A compact record of one action the AI took and what came of it, kept separate from reasoning and the answer.",
    code: `<ToolResult
  status="success" // running | success | error | cancelled
  title="Saved notes to your workspace"
  tool="Workspace · save_file"
  summary="notes.md · 1.2 KB"
  duration={2}
  fields={[
    { label: "File", value: "notes.md" },
    { label: "Location", value: "Team workspace / AI pilot" },
  ]}
  detail={{
    input: '{ "path": "AI pilot/notes.md" }',
    output: '{ "saved": true }',
  }}
  onUndo={undoSave} // shown on success
  onRetry={retrySave} // shown on error
/>`,
    preview: () => <ToolResultPreview />,
  },
  "confirmation-prompt": {
    description:
      "A focused approval for one risky action, such as sending, deleting, or purchasing, before the AI carries it out.",
    code: `<ConfirmationPrompt
  status="pending" // pending | confirming | confirmed | cancelled | error
  intent="destructive" // default | destructive
  title="Delete 14 draft reports"
  description="These files haven't been opened in over 12 months."
  fields={[
    { label: "Location", value: "Shared drive / Reports / 2025 drafts" },
    { label: "Files", value: "14 files · 38 MB" },
  ]}
  irreversible // or a custom warning node
  confirmLabel="Delete 14 files"
  onConfirm={deleteFiles}
  onCancel={cancel}
  onEdit={editRequest}
>
  {/* Optional preview, e.g. an email body */}
</ConfirmationPrompt>`,
    preview: () => <ConfirmationPromptPreview />,
  },
  "limitation-notice": {
    description:
      "A quiet, factual note about what an answer couldn't cover, such as stale data, missing access, conflicting sources, or incomplete coverage.",
    code: `<LimitationNotice
  kind="stale" // stale | permission | uncertain | partial
  title="Usage figures are from the analytics export of 30 Sep 2026."
/>

<LimitationNotice
  kind="permission"
  title="I couldn't access Finance SharePoint, so cost data isn't included."
  actionLabel="Request access"
  onAction={requestAccess}
/>

<LimitationNotice kind="partial" title="Based on 3 of 5 team reports.">
  {/* Optional detail, shown behind a "Details" toggle */}
  Two reports were password-protected PDFs and couldn't be read.
</LimitationNotice>`,
    preview: () => <LimitationNoticePreview />,
  },
  "privacy-notice": {
    description:
      "An inline disclosure of how data is used, how long it's kept, and who it's shared with, under the composer or at the moment data leaves the organization.",
    code: `const items: PrivacyNoticeItem[] = [
  { topic: "use", description: "Your prompts aren't used to train AI models." },
  { topic: "retention", description: "Chats are kept for 30 days, then deleted." },
  { topic: "sharing", description: "Data stays within the company tenant." },
]

{/* Composer: replaces the InitialCta disclaimer */}
<div>
  <InitialCta variant="chat" disclaimer="" value={prompt} onValueChange={setPrompt} onSubmit={send} />
  <PrivacyNotice
    variant="composer"
    title="AI can make mistakes. Chats are kept for 30 days and aren't used to train models."
    items={items}
    policyHref="/privacy"
  />
</div>

{/* Inline: in the turn where data leaves the organization */}
<PrivacyNotice
  variant="inline"
  title="Your search query was sent to an external web search provider."
  items={[{ topic: "sharing", description: "Only the search query was sent." }]}
/>`,
    preview: () => <PrivacyNoticePreview />,
  },
  "action-plan": {
    description:
      "The steps the AI intends to take, shown before it runs so people can review, edit, and approve them.",
    code: `const [steps, setSteps] = useState<ActionPlanStep[]>([
  { id: "metrics", title: "Gather Q3 adoption metrics", kind: "read" },
  { id: "outline", title: "Draft a 5-slide outline", kind: "reasoning" },
  { id: "deck", title: "Build the presentation", kind: "tool" },
])

<ActionPlan
  mode="contractual"
  status="draft"
  steps={steps}
  onStepsChange={setSteps}
  onApprove={runPlan}
  onRegenerate={regeneratePlan}
  onCancel={cancelPlan}
/>`,
    preview: () => <ActionPlanPreview />,
  },
}

const componentItems: NavItem[] = Object.keys(
  import.meta.glob("./components/xds/*.tsx")
).map((path) => {
  const id = path.split("/").pop()?.replace(/\.tsx$/, "") ?? ""
  const name = id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

  return {
    id,
    name:
      id === "initial-cta" ? "Initial CTA" : id === "citations" ? "Sources" : name,
    example: componentExamples[id],
  }
})

const conversationalAiIds = new Set([
  "action-plan",
  "capability-intro",
  "citations",
  "confirmation-prompt",
  "initial-cta",
  "limitation-notice",
  "privacy-notice",
  "response-status",
  "stream-of-thought",
  "suggestions",
  "tool-result",
])

const componentGroups: { name: string; items: NavItem[] }[] = [
  {
    name: "General",
    items: componentItems.filter((item) => !conversationalAiIds.has(item.id)),
  },
  {
    name: "Conversational AI",
    items: componentItems.filter((item) => conversationalAiIds.has(item.id)),
  },
  {
    name: "Example",
    items: [
      { id: "chatbot", name: "Chatbot" },
      { id: "assistant-home", name: "Assistant home" },
    ],
  },
]

const navItems = componentGroups.flatMap((group) => group.items)

const examplePages: Record<
  string,
  { description: string; render: () => ReactNode }
> = {
  chatbot: {
    description:
      "A working chat demo that combines General and Conversational AI components. Send any prompt to see the assistant think and answer with sources, with approval available in Settings.",
    render: () => <ChatbotExample />,
  },
  "assistant-home": {
    description:
      "An assistant landing page built with Capability Intro: what the assistant can do, its limits, and grouped starter prompts.",
    render: () => <AssistantHomeExample />,
  },
}

export function App() {
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null)
  const [suggestionsPlacement, setSuggestionsPlacement] =
    useState<SuggestionsPlacement>("below")
  const [showSuggestionsLabel, setShowSuggestionsLabel] = useState(true)
  const activeComponent = navItems.find((item) => item.id === activeComponentId)
  const isIntroduction = activeComponentId === null
  const examplePage = activeComponentId
    ? examplePages[activeComponentId]
    : undefined
  const example = activeComponent?.example
  const exampleCode =
    typeof example?.code === "function"
      ? example.code({ suggestionsPlacement, showSuggestionsLabel })
      : example?.code

  return (
    <div className="min-h-svh bg-background text-foreground md:grid md:grid-cols-[minmax(14rem,22vw)_minmax(0,1fr)]">
      <aside className="border-b border-border md:min-h-svh md:border-r md:border-b-0">
        <div className="px-6 py-6 md:px-8 md:py-8">
          <p className="mb-5 text-sm font-bold text-muted-foreground">Components</p>
          <nav
            aria-label="xDS components"
            className="flex flex-col gap-2"
          >
            <button
              type="button"
              aria-current={isIntroduction ? "page" : undefined}
              className={`min-h-10 w-full border-l-2 px-3 text-left text-base transition-colors ${
                isIntroduction
                  ? "border-primary bg-muted font-medium text-foreground"
                  : "border-transparent text-foreground hover:bg-muted"
              }`}
              onClick={() => setActiveComponentId(null)}
            >
              Overview
            </button>
            {componentGroups.map((group) => (
              <details
                key={group.name}
                open={group.name !== "General"}
                className="group/nav"
              >
                <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 px-3 text-base font-medium text-foreground marker:hidden hover:bg-muted">
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-open/nav:rotate-90"
                  />
                  {group.name}
                </summary>
                <div className="mt-1 flex flex-col gap-1 pl-4">
                  {group.items.map((item) => {
                    const isActive = item.id === activeComponentId

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-current={isActive ? "page" : undefined}
                        className={`min-h-10 w-full border-l-2 px-3 text-left text-base transition-colors ${
                          isActive
                            ? "border-primary bg-muted font-medium text-foreground"
                            : "border-transparent text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setActiveComponentId(item.id)}
                      >
                        {item.name}
                      </button>
                    )
                  })}
                </div>
              </details>
            ))}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 px-6 py-10 md:px-[clamp(3rem,6.75vw,9.375rem)] md:py-12">
        {isIntroduction ? (
          <>
            <header>
              <h1 className="text-5xl leading-none font-bold">
                Conversational AI Components
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-muted-foreground">
                Composable patterns for AI conversations, from the first prompt
                to grounded answers and human-approved actions.
              </p>
            </header>
            <section aria-label="Explore the library" className="mt-12 max-w-5xl">
              <h2 className="mb-4 text-sm font-bold text-muted-foreground">
                Explore the library
              </h2>
              <div className="grid border-t border-border sm:grid-cols-2">
                {[
                  {
                    id: "initial-cta",
                    title: "Start a conversation",
                    description: "Prompt composer, modes, and attachments.",
                  },
                  {
                    id: "action-plan",
                    title: "Guide the interaction",
                    description: "Reviewable plans and approval steps.",
                  },
                  {
                    id: "citations",
                    title: "Ground responses",
                    description: "Sources and inline references for answers.",
                  },
                  {
                    id: "chatbot",
                    title: "See it in context",
                    description: "A working example combining the library.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="border-b border-border py-5 text-left hover:bg-muted sm:px-4"
                    onClick={() => setActiveComponentId(item.id)}
                  >
                    <span className="block text-lg font-medium">{item.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <header>
              <h1 className="text-5xl leading-none font-bold">
                {activeComponent?.name ?? "Components"}
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-muted-foreground">
                {examplePage
                  ? examplePage.description
                  : example?.description ?? "Preview the selected xDS component."}
              </p>
            </header>

            {examplePage ? (
          <section
            aria-label={`${activeComponent?.name} example`}
            className="mt-10 flex h-[min(56rem,calc(100svh-6rem))] min-h-[36rem] flex-col border border-border"
          >
            {examplePage.render()}
          </section>
        ) : (
              <section
                aria-label={`${activeComponent?.name ?? "Component"} preview`}
                className="mt-10 flex min-h-[28rem] flex-col border border-border"
              >
                <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                  {example ? (
                    example.preview({
                      suggestionsPlacement,
                      showSuggestionsLabel,
                      onSuggestionsPlacementChange: setSuggestionsPlacement,
                      onShowSuggestionsLabelChange: setShowSuggestionsLabel,
                    })
                  ) : (
                    <p className="text-muted-foreground">
                      Add a preview for this component to the component examples.
                    </p>
                  )}
                </div>

                <details className="group border-t border-border">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-5 py-3 text-muted-foreground marker:hidden">
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-open:rotate-90"
                    />
                    Code
                  </summary>
                  <pre className="overflow-x-auto border-t border-border bg-muted/30 p-5 text-sm leading-relaxed">
                    <code>{exampleCode ?? "// Preview not yet configured"}</code>
                  </pre>
                </details>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App

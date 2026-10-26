import { useEffect, useState, type ReactNode } from "react"
import { ChevronRight } from "lucide-react"

import {
  ActionPlan,
  type ActionPlanMode,
  type ActionPlanStatus,
  type ActionPlanStep,
  type ActionPlanStepStatus,
} from "@/components/xds/action-plan"
import { Button } from "@/components/xds/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/xds/card"
import {
  Citations,
  CitationReference,
  type CitationItem,
} from "@/components/xds/citations"
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
  InitialCta,
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
  const [feedback, setFeedback] = useState("")

  function handleSubmit(payload: InitialCtaSubmitPayload) {
    setFeedback(
      `Ready to ${payload.mode ?? "create"}${payload.templateId ? ` with ${payload.templateId}` : ""}: ${payload.prompt}`
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
          onAttach={() => setFeedback("Connect this action to a file or link picker.")}
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
      <Textarea
        aria-label="Prompt preview"
        className="min-h-32"
        placeholder="Choose a suggestion to start..."
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />
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

function CitationsPreview() {
  return (
    <Citations
      ariaLabel="References"
      className="w-full max-w-2xl"
      items={exampleCitations}
    >
      <p>
        Risk reviews should continue as the system and its operating context
        evolve<CitationReference citationId="risk-framework" />. Generative AI
        systems also have dedicated risk considerations
        <CitationReference citationId="deployment-checklist" />.
      </p>
    </Citations>
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

<Citations items={sources}>
  <p>
    Risk reviews should continue as systems evolve
    <CitationReference citationId="risk-framework" />.
  </p>
</Citations>`,
    preview: () => <CitationsPreview />,
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
    code: `const showLabel = true

<div>
  {showLabel && <p>Try one of these</p>}
  <Suggestions
    items={suggestions}
    onSelect={(prompt) => setPrompt(prompt)}
  />
</div>`,
    preview: () => <SuggestionsPreview />,
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

const componentItems = Object.keys(
  import.meta.glob("./components/xds/*.tsx")
).map((path) => {
  const id = path.split("/").pop()?.replace(/\.tsx$/, "") ?? ""
  const name = id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

  return {
    id,
    name: id === "initial-cta" ? "Initial CTA" : name,
    example: componentExamples[id],
  }
})

const conversationalAiIds = new Set([
  "action-plan",
  "citations",
  "initial-cta",
  "stream-of-thought",
  "suggestions",
])

const componentGroups = [
  {
    name: "General",
    items: componentItems.filter((item) => !conversationalAiIds.has(item.id)),
  },
  {
    name: "Conversational AI",
    items: componentItems.filter((item) => conversationalAiIds.has(item.id)),
  },
]

const initialComponent = componentItems.find((item) => item.id === "card")
  ?.id ?? componentItems[0]?.id ?? ""

export function App() {
  const [activeComponentId, setActiveComponentId] = useState(initialComponent)
  const [suggestionsPlacement, setSuggestionsPlacement] =
    useState<SuggestionsPlacement>("below")
  const [showSuggestionsLabel, setShowSuggestionsLabel] = useState(true)
  const activeComponent = componentItems.find(
    (item) => item.id === activeComponentId
  )
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
            {componentGroups.map((group) => (
              <details key={group.name} open className="group/nav">
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
        <header>
          <h1 className="text-5xl leading-none font-bold">
            {activeComponent?.name ?? "Components"}
          </h1>
          <p className="mt-5 max-w-4xl text-2xl leading-snug text-muted-foreground">
            {example?.description ?? "Preview the selected xDS component."}
          </p>
        </header>

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
      </main>
    </div>
  )
}

export default App

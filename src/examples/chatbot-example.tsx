import { useEffect, useRef, useState } from "react"
import {
  Check,
  Copy,
  Pencil,
  RotateCcw,
  Settings2,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"

import { Button } from "@/components/xds/button"
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
} from "@/components/xds/dialog"
import { Attachments } from "@/components/xds/attachments"
import {
  INITIAL_CTA_ATTACHMENT_ACCEPT,
  InitialCta,
  isSupportedInitialCtaAttachment,
} from "@/components/xds/initial-cta"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/xds/sheet"
import {
  StreamOfThought,
  type StreamOfThoughtStatus,
  type ThoughtStep,
} from "@/components/xds/stream-of-thought"
import { Textarea } from "@/components/xds/textarea"
import {
  Suggestions,
  type SuggestionItem,
} from "@/components/xds/suggestions"
type AnswerSegment = { text: string; citationId?: string }

type CannedResponse = {
  sources: CitationItem[]
  paragraphs: AnswerSegment[][]
  followUps: SuggestionItem[]
}

type LaidOutSegment = AnswerSegment & {
  paragraph: number
  start: number
  words: string[]
}

type Settings = {
  requireApproval: boolean
  simulateError: boolean
  streamAnswer: boolean
}

type Turn = {
  id: number
  prompt: string
  attachments: File[]
  mode: string
  responseIndex: number
  phase: number
  failed: boolean
  retried: boolean
  approved: boolean
  stopped: boolean
  wordCount: number
  feedback: "like" | "dislike" | null
  feedbackText: string
  requireApproval: boolean
  simulateError: boolean
}

const starterSuggestions: SuggestionItem[] = [
  {
    label: "Summarize AI risks",
    prompt: "Summarize the key risks of deploying generative AI in our team.",
  },
  {
    label: "Draft a rollout plan",
    prompt: "Draft a short rollout plan for an internal AI assistant.",
  },
  {
    label: "Explain accessibility basics",
    prompt: "Explain the basics of accessible design for chat interfaces.",
  },
]

const nistFramework: CitationItem = {
  id: "nist-rmf",
  title: "AI Risk Management Framework",
  source: "NIST",
  href: "https://www.nist.gov/itl/ai-risk-management-framework",
  locator: "AI RMF 1.0",
}

const nistGenAi: CitationItem = {
  id: "nist-genai",
  title: "Generative Artificial Intelligence Profile",
  source: "NIST",
  href: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf",
  locator: "NIST AI 600-1",
}

const wcag: CitationItem = {
  id: "wcag",
  title: "Web Content Accessibility Guidelines (WCAG) 2.2",
  source: "W3C",
  href: "https://www.w3.org/TR/WCAG22/",
  locator: "W3C Recommendation",
}

const cannedResponses: CannedResponse[] = [
  {
    sources: [nistFramework, nistGenAi],
    paragraphs: [
      [
        {
          text: "Here is a placeholder summary based on your request. Responsible deployment starts with clear governance: define who owns the system, how decisions are reviewed, and when it should be retired.",
          citationId: "nist-rmf",
        },
      ],
      [
        {
          text: "Generative systems add specific risks such as confabulated answers, data leakage, and harmful content, so monitoring should continue after launch.",
          citationId: "nist-genai",
        },
        {
          text: "Start small, measure outcomes, and expand once the controls are proven.",
        },
      ],
    ],
    followUps: [
      { label: "Turn this into a checklist", prompt: "Turn this summary into a checklist." },
      { label: "Which risks matter most?", prompt: "Which of these risks matter most for a pilot?" },
    ],
  },
  {
    sources: [nistFramework, wcag],
    paragraphs: [
      [
        {
          text: "This is placeholder content for a rollout plan. Phase one maps the use case, the people affected, and the measures of success before any build begins.",
          citationId: "nist-rmf",
        },
      ],
      [
        {
          text: "Phase two pilots the assistant with a small group and checks that the interface works with a keyboard and a screen reader.",
          citationId: "wcag",
        },
        {
          text: "Phase three expands access gradually while collecting feedback and usage data.",
        },
      ],
    ],
    followUps: [
      { label: "Add a timeline", prompt: "Add a rough timeline to this rollout plan." },
      { label: "Who should be involved?", prompt: "Who should be involved in each phase?" },
    ],
  },
  {
    sources: [wcag, nistGenAi],
    paragraphs: [
      [
        {
          text: "Placeholder answer: accessible chat interfaces announce new content without stealing focus, keep every action reachable by keyboard, and maintain sufficient color contrast.",
          citationId: "wcag",
        },
      ],
      [
        {
          text: "Because AI responses can be wrong, show sources and make it easy to verify, stop, or regenerate an answer.",
          citationId: "nist-genai",
        },
      ],
    ],
    followUps: [
      { label: "Show an example", prompt: "Show an example of an accessible chat message." },
      { label: "How do I test this?", prompt: "How do I test a chat interface for accessibility?" },
    ],
  },
]

const errorStepIndex = 3
const approvalStepIndex = 4

function buildSteps(prompt: string, sources: CitationItem[]) {
  const shortPrompt = prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt

  return [
    {
      id: "understand",
      title: "Understanding the request",
      kind: "reasoning",
      description: `Interpreting: "${shortPrompt}"`,
      duration: 2,
    },
    {
      id: "search",
      title: "Searching trusted sources",
      kind: "search",
      detail: { input: `query: "${shortPrompt}"` },
      sources,
      duration: 3,
    },
    {
      id: "read",
      title: "Reading the most relevant documents",
      kind: "read",
      description: `Reviewing ${sources.length} documents for key points.`,
      duration: 2,
    },
    {
      id: "extract",
      title: "Extracting key points",
      kind: "tool",
      detail: {
        input: '{ "documents": 2, "max_points": 5 }',
        output: '{ "points": 5, "confidence": "medium" }',
      },
      duration: 2,
    },
    {
      id: "save",
      title: "Save notes to your workspace",
      kind: "code",
      description: "Writing to a shared location requires your approval.",
      detail: { language: "python", code: 'workspace.save("notes.md", notes)' },
      duration: 1,
    },
    {
      id: "compose",
      title: "Composing the answer",
      kind: "reasoning",
      duration: 1,
    },
  ] satisfies (Omit<ThoughtStep, "status"> & { duration: number })[]
}

function layoutAnswer(paragraphs: AnswerSegment[][]) {
  const segments: LaidOutSegment[] = []
  let total = 0

  paragraphs.forEach((paragraph, paragraphIndex) => {
    for (const segment of paragraph) {
      const words = segment.text.split(" ")
      segments.push({ ...segment, paragraph: paragraphIndex, start: total, words })
      total += words.length
    }
  })

  return { segments, total }
}

const laidOutResponses = cannedResponses.map((response) =>
  layoutAnswer(response.paragraphs)
)

function getStatus(turn: Turn): StreamOfThoughtStatus {
  const stepCount = buildSteps(turn.prompt, []).length
  if (turn.phase >= stepCount) return "complete"
  if (turn.stopped) return "stopped"
  if (turn.failed) return "error"
  if (isWaiting(turn)) return "waiting"
  return "thinking"
}

function isWaiting(turn: Turn) {
  return (
    turn.requireApproval &&
    turn.phase === approvalStepIndex &&
    !turn.approved &&
    !turn.stopped
  )
}

function createTurn(
  id: number,
  prompt: string,
  mode: string,
  settings: Settings,
  attachments: File[] = []
): Turn {
  return {
    id,
    prompt,
    attachments,
    mode,
    responseIndex: id % cannedResponses.length,
    phase: 0,
    failed: false,
    retried: false,
    approved: false,
    stopped: false,
    wordCount: 0,
    feedback: null,
    feedbackText: "",
    requireApproval: settings.requireApproval,
    simulateError: settings.simulateError,
  }
}

function updateLast(turns: Turn[], update: (turn: Turn) => Turn) {
  return turns.map((turn, index) =>
    index === turns.length - 1 ? update(turn) : turn
  )
}

function answerText(responseIndex: number) {
  return cannedResponses[responseIndex].paragraphs
    .map((paragraph) => paragraph.map((segment) => segment.text).join(" "))
    .join("\n\n")
}

function AnswerBody({
  responseIndex,
  wordCount,
}: {
  responseIndex: number
  wordCount: number
}) {
  const { segments } = laidOutResponses[responseIndex]
  const paragraphCount = cannedResponses[responseIndex].paragraphs.length

  return (
    <div className="space-y-2 text-sm">
      {Array.from({ length: paragraphCount }, (_, paragraphIndex) => {
        const visible = segments.filter(
          (segment) =>
            segment.paragraph === paragraphIndex && segment.start < wordCount
        )
        if (visible.length === 0) return null

        return (
          <p key={paragraphIndex}>
            {visible.map((segment, index) => {
              const shown = segment.words.slice(0, wordCount - segment.start)
              const isComplete = shown.length === segment.words.length

              return (
                <span key={segment.start}>
                  {index > 0 && " "}
                  {shown.join(" ")}
                  {isComplete && segment.citationId && (
                    <CitationReference citationId={segment.citationId} />
                  )}
                </span>
              )
            })}
          </p>
        )
      })}
    </div>
  )
}

function SettingsSheet({
  settings,
  onChange,
}: {
  settings: Settings
  onChange: (settings: Settings) => void
}) {
  const options: { key: keyof Settings; label: string; description: string }[] = [
    {
      key: "requireApproval",
      label: "Require approval",
      description: "Pause before the assistant saves notes to your workspace.",
    },
    {
      key: "simulateError",
      label: "Simulate a tool error",
      description: "Fail the extraction step once so you can retry it.",
    },
    {
      key: "streamAnswer",
      label: "Stream the answer",
      description: "Reveal the answer word by word instead of all at once.",
    },
  ]

  return (
    <Sheet>
      <SheetTrigger render={<Button size="sm" type="button" variant="tertiary" />}>
        <Settings2 aria-hidden="true" />
        Settings
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chat settings</SheetTitle>
          <SheetDescription>
            Changes apply to the next message you send.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">
          {options.map((option) => (
            <label key={option.key} className="flex items-start gap-3">
              <input
                checked={settings[option.key]}
                className="mt-1 size-4 accent-primary"
                type="checkbox"
                onChange={(event) =>
                  onChange({ ...settings, [option.key]: event.target.checked })
                }
              />
              <span>
                <span className="block font-medium">{option.label}</span>
                <span className="block text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function ChatbotExample() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [prompt, setPrompt] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [mode, setMode] = useState("assistant")
  const [composerNotice, setComposerNotice] = useState("")
  const [nextId, setNextId] = useState(0)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null)
  const [feedbackTurnId, setFeedbackTurnId] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [settings, setSettings] = useState<Settings>({
    requireApproval: false,
    simulateError: false,
    streamAnswer: true,
  })
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const live = turns.at(-1)
  const liveStatus = live ? getStatus(live) : undefined
  const liveTotalWords = live ? laidOutResponses[live.responseIndex].total : 0
  const isAnswering =
    liveStatus === "complete" && (live?.wordCount ?? 0) < liveTotalWords
  const isRunning =
    liveStatus === "thinking" ||
    liveStatus === "waiting" ||
    liveStatus === "error" ||
    isAnswering
  const instantAnswer = !settings.streamAnswer || reducedMotion

  useEffect(() => {
    if (liveStatus === "thinking") {
      const timer = window.setTimeout(() => {
        setTurns((current) =>
          updateLast(current, (turn) =>
            turn.phase === errorStepIndex && turn.simulateError && !turn.retried
              ? { ...turn, failed: true }
              : { ...turn, phase: turn.phase + 1 }
          )
        )
      }, 1400)
      return () => window.clearTimeout(timer)
    }

    if (isAnswering) {
      const timer = window.setTimeout(() => {
        setTurns((current) =>
          updateLast(current, (turn) => ({
            ...turn,
            wordCount: instantAnswer ? liveTotalWords : turn.wordCount + 2,
          }))
        )
      }, 40)
      return () => window.clearTimeout(timer)
    }
  }, [live, liveStatus, isAnswering, instantAnswer, liveTotalWords])

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [turns])

  function send(
    text: string,
    submittedMode = mode,
    submittedAttachments: File[] = attachments
  ) {
    const trimmed = text.trim()
    if (!trimmed || isRunning) return
    setTurns((current) => [
      ...current,
      createTurn(nextId, trimmed, submittedMode, settings, submittedAttachments),
    ])
    setNextId((current) => current + 1)
    setPrompt("")
    setAttachments([])
    setComposerNotice("")
  }

  function updateLive(update: (turn: Turn) => Turn) {
    setTurns((current) => updateLast(current, update))
  }

  function updateTurn(turnId: number, update: (turn: Turn) => Turn) {
    setTurns((current) =>
      current.map((turn) => (turn.id === turnId ? update(turn) : turn))
    )
  }

  function regenerate() {
    if (!live) return
    setTurns((current) => [
      ...current.slice(0, -1),
      createTurn(nextId, live.prompt, live.mode, settings, live.attachments),
    ])
    setNextId((current) => current + 1)
  }

  function newChat() {
    setTurns([])
    setPrompt("")
    setAttachments([])
  }

  function editPrompt(turn: Turn) {
    setTurns((current) => current.filter((item) => item.id < turn.id))
    setPrompt(turn.prompt)
    setAttachments(turn.attachments)
    setMode(turn.mode)
    setComposerNotice("")
  }

  async function copyPrompt(turn: Turn) {
    await navigator.clipboard?.writeText(turn.prompt)
    setCopiedPromptId(turn.id)
    window.setTimeout(() => setCopiedPromptId(null), 1500)
  }

  async function copyAnswer(turn: Turn) {
    await navigator.clipboard?.writeText(answerText(turn.responseIndex))
    setCopiedId(turn.id)
    window.setTimeout(() => setCopiedId(null), 1500)
  }

  const composer = (
    <InitialCta
      variant="chat"
      title="Message the assistant"
      placeholder={isRunning ? "Waiting for the response..." : "Ask a question..."}
      modes={[
        { value: "assistant", label: "Assistant" },
        { value: "novartis-chat", label: "Novartis Chat" },
      ]}
      mode={mode}
      onModeChange={setMode}
      onAttach={() => fileInputRef.current?.click()}
      attachments={attachments}
      onAttachmentsChange={setAttachments}
      onVoiceInput={() => setComposerNotice("Voice input is not connected in this demo.")}
      submitLabel="Send"
      disabled={isRunning}
      value={prompt}
      onValueChange={setPrompt}
      onSubmit={({ prompt: submitted, mode: submittedMode, attachments: submittedAttachments }) =>
        send(submitted, submittedMode, submittedAttachments)
      }
    />
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
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
          setComposerNotice(
            rejectedFiles.length > 0
              ? "Only PDF, DOCX, XLSX, PNG, and JPG files can be attached."
              : acceptedFiles.length > 0
                ? `${acceptedFiles.length} file${acceptedFiles.length === 1 ? "" : "s"} attached.`
                : ""
          )
          event.target.value = ""
        }}
      />
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <p className="text-sm font-medium text-muted-foreground">
          Placeholder assistant
        </p>
        <div className="flex items-center gap-2">
          <SettingsSheet settings={settings} onChange={setSettings} />
          <Button
            disabled={turns.length === 0}
            size="sm"
            type="button"
            variant="outline"
            onClick={newChat}
          >
            <SquarePen aria-hidden="true" />
            New chat
          </Button>
        </div>
      </div>

      {turns.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6">
          <div className="w-full max-w-2xl space-y-6">
            <h2 className="text-center text-3xl font-bold">
              How can I help today?
            </h2>
            {composer}
            {composerNotice && (
              <p className="text-sm text-muted-foreground" role="status">
                {composerNotice}
              </p>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Try one of these
              </p>
              <Suggestions
                ariaLabel="Try one of these"
                items={starterSuggestions}
                onSelect={setPrompt}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
            <ol aria-label="Conversation" className="mx-auto flex max-w-2xl flex-col gap-8">
              {turns.map((turn) => {
                const isLive = turn === live
                const status = getStatus(turn)
                const response = cannedResponses[turn.responseIndex]
                const { total } = laidOutResponses[turn.responseIndex]
                const steps: ThoughtStep[] = buildSteps(
                  turn.prompt,
                  response.sources
                ).map((step, index) => ({
                  ...step,
                  retried: index === errorStepIndex && turn.retried,
                  status:
                    index < turn.phase
                      ? "complete"
                      : index > turn.phase || turn.stopped
                        ? "queued"
                        : turn.failed
                          ? "error"
                          : isWaiting(turn)
                            ? "waiting"
                            : "running",
                }))
                const elapsed = steps
                  .slice(0, turn.phase)
                  .reduce((sum, step) => sum + (step.duration ?? 0), 0)
                const answerDone = status === "complete" && turn.wordCount >= total

                return (
                  <li key={turn.id} className="flex flex-col gap-4">
                    <div className="flex max-w-[80%] flex-col items-end gap-1 self-end">
                      <div className="bg-muted px-4 py-2">
                        <p className="mb-1 text-xs text-muted-foreground">
                          {turn.mode === "assistant" ? "Assistant" : "Novartis Chat"}
                        </p>
                        <p>{turn.prompt}</p>
                        {turn.attachments.length > 0 && (
                          <Attachments files={turn.attachments} />
                        )}
                      </div>
                      <div className="flex justify-end gap-0">
                        <Button
                          aria-label="Edit prompt"
                          size="icon-xs"
                          title="Edit prompt"
                          type="button"
                          variant="tertiary"
                          onClick={() => editPrompt(turn)}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          aria-label={
                            copiedPromptId === turn.id
                              ? "Prompt copied to clipboard"
                              : "Copy prompt"
                          }
                          size="icon-xs"
                          title={
                            copiedPromptId === turn.id
                              ? "Prompt copied to clipboard"
                              : "Copy prompt"
                          }
                          type="button"
                          variant="tertiary"
                          onClick={() => copyPrompt(turn)}
                        >
                          {copiedPromptId === turn.id ? (
                            <Check aria-hidden="true" />
                          ) : (
                            <Copy aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <StreamOfThought
                      duration={elapsed}
                      status={status}
                      steps={steps}
                      onApprove={
                        isLive ? () => updateLive((t) => ({ ...t, approved: true })) : undefined
                      }
                      onReject={
                        isLive ? () => updateLive((t) => ({ ...t, stopped: true })) : undefined
                      }
                      onRetry={
                        isLive
                          ? () => updateLive((t) => ({ ...t, failed: false, retried: true }))
                          : undefined
                      }
                      onStop={
                        isLive ? () => updateLive((t) => ({ ...t, stopped: true })) : undefined
                      }
                    />

                    {status === "complete" && (
                      <div aria-busy={!answerDone} className="space-y-4">
                        <Sources
                          ariaLabel="Sources"
                          items={response.sources}
                          showDisclosure={answerDone}
                          toolbar={
                            answerDone ? (
                              <div
                                aria-label="Answer actions"
                                className="flex shrink-0 items-center gap-0.5"
                                role="group"
                              >
                                <Button
                                  aria-label={copiedId === turn.id ? "Copied to clipboard" : "Copy answer"}
                                  size="icon-xs"
                                  type="button"
                                  variant="tertiary"
                                  title={copiedId === turn.id ? "Copied to clipboard" : "Copy answer"}
                                  onClick={() => copyAnswer(turn)}
                                >
                                  {copiedId === turn.id ? (
                                    <Check aria-hidden="true" />
                                  ) : (
                                    <Copy aria-hidden="true" />
                                  )}
                                </Button>
                                <Button
                                  aria-label="Like answer"
                                  aria-pressed={turn.feedback === "like"}
                                  className={turn.feedback === "like" ? "text-green" : undefined}
                                  size="icon-xs"
                                  title="Like answer"
                                  type="button"
                                  variant="tertiary"
                                  onClick={() =>
                                    updateTurn(turn.id, (current) => ({
                                      ...current,
                                      feedback: current.feedback === "like" ? null : "like",
                                    }))
                                  }
                                >
                                  <ThumbsUp
                                    aria-hidden="true"
                                    fill={turn.feedback === "like" ? "currentColor" : "none"}
                                  />
                                </Button>
                                <Button
                                  aria-label="Dislike answer"
                                  aria-pressed={turn.feedback === "dislike"}
                                  className={turn.feedback === "dislike" ? "text-red" : undefined}
                                  size="icon-xs"
                                  title="Dislike answer"
                                  type="button"
                                  variant="tertiary"
                                  onClick={() => {
                                    setFeedbackText(turn.feedbackText)
                                    setFeedbackTurnId(turn.id)
                                  }}
                                >
                                  <ThumbsDown
                                    aria-hidden="true"
                                    fill={turn.feedback === "dislike" ? "currentColor" : "none"}
                                  />
                                </Button>
                                {isLive && (
                                  <Button
                                    aria-label="Regenerate answer"
                                    size="icon-xs"
                                    title="Regenerate answer"
                                    type="button"
                                    variant="tertiary"
                                    onClick={regenerate}
                                  >
                                    <RotateCcw aria-hidden="true" />
                                  </Button>
                                )}
                              </div>
                            ) : undefined
                          }
                        >
                          <AnswerBody
                            responseIndex={turn.responseIndex}
                            wordCount={turn.wordCount}
                          />
                        </Sources>

                        {answerDone && (
                          <Dialog
                            open={feedbackTurnId === turn.id}
                            onOpenChange={(open) => {
                              if (!open) setFeedbackTurnId(null)
                            }}
                          >
                            <DialogContent>
                              <form
                                className="space-y-5"
                                onSubmit={(event) => {
                                  event.preventDefault()
                                  updateTurn(turn.id, (current) => ({
                                    ...current,
                                    feedback: "dislike",
                                    feedbackText: feedbackText.trim(),
                                  }))
                                  setFeedbackTurnId(null)
                                }}
                              >
                                <DialogHeader>
                                  <DialogTitle>What could be better?</DialogTitle>
                                  <DialogDescription>
                                    Your feedback helps improve this answer.
                                  </DialogDescription>
                                </DialogHeader>
                                <Textarea
                                  aria-label="Feedback for this answer"
                                  className="min-h-32 resize-y"
                                  placeholder="What could be improved?"
                                  required
                                  value={feedbackText}
                                  onChange={(event) => setFeedbackText(event.target.value)}
                                />
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setFeedbackTurnId(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button disabled={!feedbackText.trim()} type="submit">
                                    Submit feedback
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        )}

                        {answerDone && isLive && (
                          <Suggestions
                            ariaLabel="Follow-up suggestions"
                            items={response.followUps}
                            onSelect={setPrompt}
                          />
                        )}
                      </div>
                    )}

                    {status === "stopped" && (
                      <div className="flex flex-wrap items-center gap-3" role="status">
                        <p className="text-sm text-muted-foreground">
                          Response stopped.
                        </p>
                        {isLive && (
                          <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={regenerate}
                          >
                            <RotateCcw aria-hidden="true" />
                            Regenerate
                          </Button>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
          <div className="p-4">
            <div className="mx-auto max-w-2xl space-y-2">
              {composer}
              {composerNotice && (
                <p className="text-sm text-muted-foreground" role="status">
                  {composerNotice}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

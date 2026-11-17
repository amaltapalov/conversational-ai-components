import { useState } from "react"
import { FileText, ListChecks, PenLine } from "lucide-react"

import {
  CapabilityIntro,
  type CapabilityItem,
} from "@/components/xds/capability-intro"
import { InitialCta } from "@/components/xds/initial-cta"

const capabilities: CapabilityItem[] = [
  {
    id: "summarize",
    title: "Summarize documents",
    description: "Pull out key points, decisions, and open questions.",
    icon: <FileText />,
    starters: [
      {
        label: "Summarize meeting notes",
        prompt: "Summarize these meeting notes into decisions and next steps.",
      },
    ],
  },
  {
    id: "draft",
    title: "Draft content",
    description: "Write emails, outlines, and first drafts in your tone.",
    icon: <PenLine />,
    starters: [
      {
        label: "Draft a project update",
        prompt: "Draft a short project update email for my stakeholders.",
      },
    ],
  },
  {
    id: "plan",
    title: "Plan work",
    description: "Break goals into steps, timelines, and owners.",
    icon: <ListChecks />,
    starters: [
      {
        label: "Plan a pilot",
        prompt: "Create a four-week plan for piloting an internal AI assistant.",
      },
    ],
  },
]

export function AssistantHomeExample() {
  const [prompt, setPrompt] = useState("")
  const [notice, setNotice] = useState("")

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-6">
      <CapabilityIntro
        className="m-auto max-w-3xl"
        title="Hi, I'm your work assistant"
        description="Ask a question or start from one of the examples below."
        capabilities={capabilities}
        startersLayout="grouped"
        onSelectStarter={setPrompt}
      >
        <div className="space-y-2">
          <InitialCta
            variant="chat"
            title="Message the assistant"
            placeholder="Ask a question..."
            disclaimer="AI can make mistakes. Your files aren't accessed unless you attach them."
            submitLabel="Send"
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={({ prompt: submitted }) => {
              setNotice(`Ready to send: "${submitted}"`)
              setPrompt("")
            }}
          />
          {notice && (
            <p className="text-sm text-muted-foreground" role="status">
              {notice}
            </p>
          )}
        </div>
      </CapabilityIntro>
    </div>
  )
}

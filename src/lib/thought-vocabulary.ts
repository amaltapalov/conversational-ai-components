import { Brain, Code, FileText, Search, Wrench } from "lucide-react"

import type {
  StreamOfThoughtStatus,
  ThoughtStepKind,
} from "@/components/xds/stream-of-thought"

export type ResponseActivity = ThoughtStepKind | "drafting"

type Icon = typeof Brain

export const thoughtKindIcon: Record<ThoughtStepKind, Icon> = {
  reasoning: Brain,
  search: Search,
  read: FileText,
  tool: Wrench,
  code: Code,
}

export const thoughtKindLabel: Record<ThoughtStepKind, string> = {
  reasoning: "Reasoning",
  search: "Search",
  read: "Read",
  tool: "Tool call",
  code: "Code",
}

export const responseActivityLabel: Record<ResponseActivity, string> = {
  reasoning: "Thinking",
  search: "Searching",
  read: "Reading",
  tool: "Using tools",
  code: "Running code",
  drafting: "Drafting",
}

export const streamStatusLabel: Record<
  Exclude<StreamOfThoughtStatus, "complete">,
  string
> = {
  thinking: "Thinking…",
  waiting: "Waiting for approval",
  error: "Something went wrong",
  stopped: "Stopped",
}

export function formatDuration(seconds: number) {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))}s`
  const minutes = Math.floor(seconds / 60)
  const rest = Math.round(seconds % 60)
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`
}

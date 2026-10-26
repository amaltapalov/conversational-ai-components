import { useState, type FormEvent } from "react"
import { ArrowUp, Mic, Paperclip, Plus } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/xds/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/xds/select"
import { Textarea } from "@/components/xds/textarea"
import type { SuggestionItem } from "@/components/xds/suggestions"

export type InitialCtaSuggestion = SuggestionItem

export type InitialCtaMode = {
  value: string
  label: string
}

export type InitialCtaTemplate = {
  id: string
  label: string
  prompt: string
}

export type InitialCtaSubmitPayload = {
  prompt: string
  mode?: string
  templateId?: string
}

export type InitialCtaProps = {
  variant?: "standard" | "chat"
  className?: string
  title?: string
  description?: string
  value: string
  onValueChange: (value: string) => void
  onSubmit: (payload: InitialCtaSubmitPayload) => void
  placeholder?: string
  modes?: InitialCtaMode[]
  mode?: string
  defaultMode?: string
  onModeChange?: (mode: string) => void
  templates?: InitialCtaTemplate[]
  templateId?: string
  defaultTemplateId?: string
  onTemplateChange?: (templateId: string | undefined) => void
  onAttach?: () => void
  onVoiceInput?: () => void
  disclaimer?: string
  attachLabel?: string
  submitLabel?: string
  disabled?: boolean
}

function InitialCta({
  variant = "standard",
  className,
  title = "What would you like to do?",
  description,
  value,
  onValueChange,
  onSubmit,
  placeholder = "Describe what you want to get done...",
  modes = [],
  mode,
  defaultMode,
  onModeChange,
  templates = [],
  templateId,
  defaultTemplateId,
  onTemplateChange,
  onAttach,
  onVoiceInput,
  disclaimer = "AI responses may be inaccurate. Verify important information.",
  attachLabel = "Attach",
  submitLabel = "Generate",
  disabled = false,
}: InitialCtaProps) {
  const [uncontrolledMode, setUncontrolledMode] = useState(
    defaultMode ?? modes[0]?.value
  )
  const [uncontrolledTemplateId, setUncontrolledTemplateId] = useState(
    defaultTemplateId
  )
  const selectedMode = mode ?? uncontrolledMode
  const selectedTemplateId = templateId ?? uncontrolledTemplateId
  const canSubmit = value.trim().length > 0 && !disabled

  function updateMode(nextMode: string | null) {
    if (nextMode === null) return
    if (mode === undefined) setUncontrolledMode(nextMode)
    onModeChange?.(nextMode)
  }

  function updateTemplate(nextTemplateId: string | null) {
    const nextTemplate = templates.find((template) => template.id === nextTemplateId)
    if (!nextTemplate) return
    if (templateId === undefined) setUncontrolledTemplateId(nextTemplate.id)
    onTemplateChange?.(nextTemplate.id)
    onValueChange(nextTemplate.prompt)
  }

  function clearTemplateSelection() {
    if (templateId === undefined) setUncontrolledTemplateId(undefined)
    onTemplateChange?.(undefined)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const prompt = value.trim()
    if (!prompt || disabled) return

    onSubmit({
      prompt,
      ...(selectedMode ? { mode: selectedMode } : {}),
      ...(selectedTemplateId ? { templateId: selectedTemplateId } : {}),
    })
  }

  if (variant === "chat") {
    return (
      <form
        className={cn("w-full", className)}
        onSubmit={handleSubmit}
      >
          <div
            className={cn(
              "border border-border focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:border-gray-800",
              disabled ? "bg-muted dark:bg-gray-900" : "bg-background dark:bg-gray-900"
            )}
          >
            <Textarea
              aria-label={title}
              className="min-h-16 resize-none border-0 bg-transparent px-4 py-4 text-sm md:text-base focus-visible:border-transparent focus-visible:ring-0 disabled:!bg-muted disabled:!opacity-100 dark:disabled:!bg-gray-900"
              disabled={disabled}
              placeholder={placeholder}
              rows={2}
              value={value}
              onChange={(event) => {
                clearTemplateSelection()
                onValueChange(event.target.value)
              }}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                {onAttach && (
                  <Button
                    aria-label={attachLabel}
                    disabled={disabled}
                    size="icon-sm"
                    title={attachLabel}
                    type="button"
                    variant="outline"
                    onClick={onAttach}
                  >
                    <Plus aria-hidden="true" />
                  </Button>
                )}

                {modes.length > 0 && (
                  <div
                    aria-label="Assistant mode"
                    className="flex flex-wrap border border-border bg-muted p-0.5 dark:border-gray-800 dark:bg-gray-900"
                    role="group"
                  >
                    {modes.map((item) => {
                      const isSelected = item.value === selectedMode

                      return (
                        <Button
                          key={item.value}
                          aria-pressed={isSelected}
                          className="border-0 text-sm"
                          disabled={disabled}
                          size="xs"
                          type="button"
                          variant={isSelected ? "secondary" : "tertiary"}
                          onClick={() => updateMode(item.value)}
                        >
                          {item.label}
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>

              {value.trim() ? (
                <Button
                  aria-label={submitLabel}
                  disabled={!canSubmit}
                  size="icon-sm"
                  type="submit"
                >
                  <ArrowUp aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  aria-label="Start voice input"
                  disabled={disabled || !onVoiceInput}
                  size="icon-sm"
                  title="Start voice input"
                  type="button"
                  variant="tertiary"
                  onClick={onVoiceInput}
                >
                  <Mic aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
          {disclaimer && (
            <p className="border border-t-0 border-border bg-muted px-4 py-3 text-sm text-muted-foreground dark:border-gray-800 dark:bg-gray-900">
              {disclaimer}
            </p>
          )}
      </form>
    )
  }

  return (
    <form
      className={cn("w-full space-y-4", className)}
      onSubmit={handleSubmit}
    >
        <header className="space-y-1">
          <h2 className="text-xl font-medium text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </header>

        <div className="border border-input bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:border-gray-800 dark:bg-gray-900">
          <Textarea
            aria-label={title}
            className="min-h-32 resize-y border-0 bg-transparent px-4 py-3 text-sm focus-visible:border-transparent focus-visible:ring-0 dark:!bg-gray-900"
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={(event) => {
              clearTemplateSelection()
              onValueChange(event.target.value)
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {modes.length > 0 && (
                <Select
                  value={selectedMode ?? null}
                  onValueChange={updateMode}
                >
                  <SelectTrigger aria-label="Mode" className="min-w-28">
                    <SelectValue placeholder="Mode">
                      {modes.find((item) => item.value === selectedMode)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start">
                    {modes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {templates.length > 0 && (
                <Select
                  value={selectedTemplateId ?? null}
                  onValueChange={updateTemplate}
                >
                  <SelectTrigger aria-label="Template" className="min-w-36">
                    <SelectValue placeholder="Use a template">
                      {templates.find((item) => item.id === selectedTemplateId)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start">
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {onAttach && (
                <Button
                  aria-label={attachLabel}
                  disabled={disabled}
                  size="sm"
                  type="button"
                  variant="tertiary"
                  onClick={onAttach}
                >
                  <Paperclip aria-hidden="true" />
                  {attachLabel}
                </Button>
              )}
            </div>

            <Button disabled={!canSubmit} type="submit">
              {submitLabel}
              <ArrowUp aria-hidden="true" />
            </Button>
          </div>
        </div>
    </form>
  )
}

export { InitialCta }
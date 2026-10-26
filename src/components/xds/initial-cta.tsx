import { useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { ArrowUp, Mic, Paperclip, Plus } from "lucide-react"

import { cn } from "cn"
import { Attachments } from "@/components/xds/attachments"
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
  attachments?: File[]
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
  attachments?: File[]
  onAttachmentsChange?: (files: File[]) => void
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
  attachments,
  onAttachmentsChange,
  onVoiceInput,
  disclaimer = "AI responses may be inaccurate. Verify important information.",
  attachLabel = "Add",
  submitLabel = "Generate",
  disabled = false,
}: InitialCtaProps) {
  const [uncontrolledMode, setUncontrolledMode] = useState(
    defaultMode ?? modes[0]?.value
  )
  const [uncontrolledTemplateId, setUncontrolledTemplateId] = useState(
    defaultTemplateId
  )
  const [uncontrolledAttachments, setUncontrolledAttachments] = useState<File[]>([])
  const [attachmentError, setAttachmentError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedMode = mode ?? uncontrolledMode
  const selectedTemplateId = templateId ?? uncontrolledTemplateId
  const selectedAttachments = attachments ?? uncontrolledAttachments
  const canSubmit = value.trim().length > 0 && !disabled
  const acceptedFileTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"

  function updateAttachments(nextAttachments: File[]) {
    if (attachments === undefined) setUncontrolledAttachments(nextAttachments)
    onAttachmentsChange?.(nextAttachments)
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])
    const validFiles = selectedFiles.filter((file) =>
      /\.(pdf|doc|docx|xls|xlsx|jpg|png)$/i.test(file.name)
    )

    setAttachmentError(
      validFiles.length === selectedFiles.length
        ? ""
        : "Some files were skipped. Choose PDF, Word, Excel, JPG, or PNG files."
    )
    if (validFiles.length > 0) {
      updateAttachments([...selectedAttachments, ...validFiles])
    }
    event.target.value = ""
  }

  function handleAttach() {
    if (onAttach) {
      onAttach()
      return
    }
    fileInputRef.current?.click()
  }

  function removeAttachment(index: number) {
    updateAttachments(selectedAttachments.filter((_, itemIndex) => itemIndex !== index))
  }

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
      ...(selectedAttachments.length > 0
        ? { attachments: selectedAttachments }
        : {}),
    })
  }

  if (variant === "chat") {
    return (
      <form
        className={cn("w-full", className)}
        onSubmit={handleSubmit}
      >
          <input
            ref={fileInputRef}
            accept={acceptedFileTypes}
            aria-label="Choose files to attach"
            className="sr-only"
            multiple
            type="file"
            onChange={handleFileSelection}
          />
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

            <Attachments
              disabled={disabled}
              files={selectedAttachments}
              onRemove={removeAttachment}
            />
            {attachmentError && (
              <p className="px-3 pt-2 text-sm text-destructive" role="alert">
                {attachmentError}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <Button
                  aria-label={attachLabel}
                  disabled={disabled}
                  size="icon-sm"
                  title={attachLabel}
                  type="button"
                  variant="outline"
                  onClick={handleAttach}
                >
                  <Plus aria-hidden="true" />
                </Button>

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
        <input
          ref={fileInputRef}
          accept={acceptedFileTypes}
          aria-label="Choose files to attach"
          className="sr-only"
          multiple
          type="file"
          onChange={handleFileSelection}
        />
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

          <Attachments
            disabled={disabled}
            files={selectedAttachments}
            onRemove={removeAttachment}
          />
          {attachmentError && (
            <p className="px-3 pt-2 text-sm text-destructive" role="alert">
              {attachmentError}
            </p>
          )}

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

              <Button
                aria-label={attachLabel}
                disabled={disabled}
                size="icon-sm"
                title={attachLabel}
                type="button"
                variant="tertiary"
                onClick={handleAttach}
              >
                <Paperclip aria-hidden="true" />
              </Button>
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
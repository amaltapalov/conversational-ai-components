import {
  useEffect,
  useState,
  type DragEvent,
  type FormEvent,
} from "react"
import {
  ArrowUp,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Plus,
  X,
} from "lucide-react"

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
  attachments: File[]
  mode?: string
  templateId?: string
}

export const INITIAL_CTA_ATTACHMENT_ACCEPT = ".pdf,.docx,.xlsx,.png,.jpg"

const supportedAttachmentExtensions = new Set([
  "pdf",
  "docx",
  "xlsx",
  "png",
  "jpg",
])

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? ""
}

export function isSupportedInitialCtaAttachment(file: File) {
  return supportedAttachmentExtensions.has(getFileExtension(file.name))
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
  onAttachmentsChange?: (attachments: File[]) => void
  attachmentError?: string
  onAttachmentErrorDismiss?: () => void
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
  attachLabel = "Attach",
  submitLabel = "Generate",
  disabled = false,
  attachmentError,
  onAttachmentErrorDismiss,
}: InitialCtaProps) {
  const [uncontrolledMode, setUncontrolledMode] = useState(
    defaultMode ?? modes[0]?.value
  )
  const [uncontrolledTemplateId, setUncontrolledTemplateId] = useState(
    defaultTemplateId
  )
  const [uncontrolledAttachments, setUncontrolledAttachments] = useState<File[]>(
    []
  )
  const [localAttachmentError, setLocalAttachmentError] = useState("")
  const [isDraggingFiles, setIsDraggingFiles] = useState(false)
  const selectedMode = mode ?? uncontrolledMode
  const selectedTemplateId = templateId ?? uncontrolledTemplateId
  const selectedAttachments = attachments ?? uncontrolledAttachments
  const canSubmit = value.trim().length > 0 && !disabled
  const visibleAttachmentError = localAttachmentError || attachmentError

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

  function updateAttachments(nextAttachments: File[]) {
    if (attachments === undefined) setUncontrolledAttachments(nextAttachments)
    onAttachmentsChange?.(nextAttachments)
  }
  function dismissAttachmentError() {
    setLocalAttachmentError("")
    onAttachmentErrorDismiss?.()
  }

  function addAttachments(files: FileList | File[]) {
    const selectedFiles = Array.from(files)
    const acceptedFiles = selectedFiles.filter(isSupportedInitialCtaAttachment)
    const rejectedFiles = selectedFiles.filter(
      (file) => !isSupportedInitialCtaAttachment(file)
    )
    const nextAttachments = [...selectedAttachments, ...acceptedFiles].filter(
      (file, index, allFiles) =>
        allFiles.findIndex(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        ) === index
    )

    updateAttachments(nextAttachments)
    setLocalAttachmentError(
      rejectedFiles.length > 0
        ? `Only PDF, DOCX, XLSX, PNG, and JPG files can be attached. Rejected: ${rejectedFiles.map((file) => file.name).join(", ")}.`
        : ""
    )
    if (rejectedFiles.length === 0) onAttachmentErrorDismiss?.()
  }

  function removeAttachment(fileToRemove: File) {
    updateAttachments(
      selectedAttachments.filter((file) => file !== fileToRemove)
    )
    dismissAttachmentError()
  }

  function handleFilesDragOver(event: DragEvent<HTMLDivElement>) {
    if (disabled || !event.dataTransfer.types.includes("Files")) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingFiles(true)
  }

  function handleFilesDrop(event: DragEvent<HTMLDivElement>) {
    if (disabled || !event.dataTransfer.types.includes("Files")) return
    event.preventDefault()
    setIsDraggingFiles(false)
    addAttachments(event.dataTransfer.files)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const prompt = value.trim()
    if (!prompt || disabled) return

    onSubmit({
      prompt,
      attachments: selectedAttachments,
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
              isDraggingFiles && "border-ring ring-3 ring-ring/50",
              disabled ? "bg-muted dark:bg-gray-900" : "bg-background dark:bg-gray-900"
            )}
            onDragEnter={handleFilesDragOver}
            onDragLeave={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                setIsDraggingFiles(false)
              }
            }}
            onDragOver={handleFilesDragOver}
            onDrop={handleFilesDrop}
          >
            {selectedAttachments.length > 0 && (
              <div className="border-b border-border px-3 py-2">
                <div
                  aria-label="Attached files"
                  className="grid min-w-0 grid-cols-2 items-start gap-3 sm:grid-cols-3"
                  role="list"
                >
                  {selectedAttachments.map((file) => (
                    <div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex w-full min-w-0 items-center gap-1.5 border border-border bg-muted/60 px-1.5 py-1 dark:bg-gray-900"
                      role="listitem"
                    >
                      {isImageAttachment(file) ? (
                        <AttachmentThumbnail file={file} />
                      ) : (
                        <AttachmentTypeIcon file={file} />
                      )}
                      <span className="min-w-0">
                        <span
                          className="block truncate text-xs font-medium text-foreground"
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        <span className="block text-[10px] uppercase text-muted-foreground">
                          {getFileExtension(file.name)}
                        </span>
                      </span>
                      <Button
                        aria-label={`Remove ${file.name}`}
                        className="shrink-0"
                        disabled={disabled}
                        size="icon-xs"
                        title={`Remove ${file.name}`}
                        type="button"
                        variant="tertiary"
                        onClick={() => removeAttachment(file)}
                      >
                        <X aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          {visibleAttachmentError && (
            <div
              className="flex items-center gap-2 border-t border-border px-3 py-2 text-xs text-destructive dark:border-gray-800"
              role="alert"
            >
              <p className="min-w-0 flex-1">{visibleAttachmentError}</p>
              <Button
                aria-label="Dismiss attachment error"
                className="shrink-0"
                size="icon-xs"
                title="Dismiss attachment error"
                type="button"
                variant="tertiary"
                onClick={dismissAttachmentError}
              >
                <X aria-hidden="true" />
              </Button>
            </div>
          )}
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

function isImageAttachment(file: File) {
  const extension = getFileExtension(file.name)
  return extension === "png" || extension === "jpg"
}

function AttachmentTypeIcon({ file }: { file: File }) {
  const extension = getFileExtension(file.name)
  const isSpreadsheet = extension === "xlsx"
  const Icon = isSpreadsheet ? FileSpreadsheet : FileText
  const styles = {
    pdf: "bg-red-100 text-red-700",
    docx: "bg-chart-16 text-foreground",
    xlsx: "bg-green-100 text-green-700",
  }[extension]

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center",
        styles
      )}
    >
      <Icon className="size-4" />
    </span>
  )
}

function AttachmentThumbnail({ file }: { file: File }) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>()

  useEffect(() => {
    const url = URL.createObjectURL(file)
    const timeoutId = window.setTimeout(() => setThumbnailUrl(url), 0)

    return () => {
      window.clearTimeout(timeoutId)
      URL.revokeObjectURL(url)
    }
  }, [file])

  return thumbnailUrl ? (
    <img
      alt=""
      className="size-7 shrink-0 object-cover"
      src={thumbnailUrl}
    />
  ) : (
    <ImageIcon
      aria-hidden="true"
      className="size-5 shrink-0 text-muted-foreground"
    />
  )
}

export { InitialCta }
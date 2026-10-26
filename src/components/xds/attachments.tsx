import { useCallback } from "react"
import { FileSpreadsheet, FileText, X } from "lucide-react"

import { Button } from "@/components/xds/button"

type AttachmentsProps = {
  files: File[]
  disabled?: boolean
  onRemove: (index: number) => void
}

type AttachmentKind = "pdf" | "word" | "excel" | "image"

function getAttachmentKind(file: File): AttachmentKind {
  const extension = file.name.split(".").pop()?.toLowerCase()

  if (extension === "pdf") return "pdf"
  if (extension === "doc" || extension === "docx") return "word"
  if (extension === "xls" || extension === "xlsx") return "excel"
  return "image"
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentPreview({ file, kind }: { file: File; kind: AttachmentKind }) {
  const extension = file.name.split(".").pop()?.toUpperCase() ?? "FILE"
  const imageRef = useCallback(
    (image: HTMLImageElement | null) => {
      if (!image) return

      const previewUrl = URL.createObjectURL(file)
      image.src = previewUrl
      return () => URL.revokeObjectURL(previewUrl)
    },
    [file]
  )

  if (kind === "image") {
    return (
      <img
        alt=""
        className="size-9 shrink-0 object-cover"
        ref={imageRef}
      />
    )
  }

  const styles = {
    pdf: "bg-red-100 text-red-700",
    word: "bg-chart-16 text-foreground",
    excel: "bg-green-100 text-green-700",
    image: "bg-chart-15 text-foreground",
  }[kind]
  const Icon = kind === "excel" ? FileSpreadsheet : FileText

  return (
    <div
      aria-hidden="true"
      className={`flex size-9 shrink-0 flex-col items-center justify-center gap-0.5 ${styles}`}
    >
      <Icon className="size-4" />
      <span className="text-[8px] leading-none font-bold">{extension}</span>
    </div>
  )
}

function Attachments({ files, disabled = false, onRemove }: AttachmentsProps) {
  if (files.length === 0) return null

  return (
    <ul
      aria-label="Attached files"
      className="flex flex-wrap gap-1.5 px-3 pt-2"
    >
      {files.map((file, index) => {
        const kind = getAttachmentKind(file)

        return (
          <li
            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
            className="flex min-w-0 max-w-56 items-center gap-1.5 border border-border bg-background p-1.5"
          >
            <AttachmentPreview file={file} kind={kind} />
            <span className="min-w-0 flex-1">
              <span
                className="block truncate text-xs font-medium text-foreground"
                title={file.name}
              >
                {file.name}
              </span>
              <span className="block text-[10px] text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
            </span>
            <Button
              aria-label={`Remove ${file.name}`}
              className="self-start"
              disabled={disabled}
              size="icon-xs"
              type="button"
              variant="tertiary"
              onClick={() => onRemove(index)}
            >
              <X aria-hidden="true" />
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export { Attachments }

import { cn } from "cn"
import { Button } from "@/components/xds/button"

export type SuggestionItem = {
  label: string
  prompt: string
}

export type SuggestionsProps = {
  className?: string
  items: SuggestionItem[]
  onSelect: (prompt: string) => void
  disabled?: boolean
  ariaLabel?: string
}

function Suggestions({
  className,
  items,
  onSelect,
  disabled = false,
  ariaLabel = "Prompt suggestions",
}: SuggestionsProps) {
  if (items.length === 0) return null

  return (
    <div
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
    >
      {items.map((item) => (
        <Button
          key={`${item.label}-${item.prompt}`}
          disabled={disabled}
          size="sm"
          type="button"
          variant="secondary"
          onClick={() => onSelect(item.prompt)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  )
}

export { Suggestions }
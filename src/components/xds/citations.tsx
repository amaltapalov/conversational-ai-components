import { createContext, useContext, useId, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "cn"
import { getSafeHref } from "@/lib/utils"

export type CitationItem = {
  id: string
  title: string
  href: string
  source?: string
  locator?: string
}

type ResolvedCitation = {
  item: CitationItem
  index: number
  targetId: string
}

const CitationContext = createContext<Map<string, ResolvedCitation> | null>(null)
const citationNumberClassName = "font-semibold text-accent-brand"

export type SourcesProps = {
  items: CitationItem[]
  children: ReactNode
  className?: string
  ariaLabel?: string
  showDisclosure?: boolean
  summaryContent?: ReactNode
  toolbar?: ReactNode
}

export type CitationReferenceProps = {
  citationId: string
  className?: string
}

function Sources({
  items,
  children,
  className,
  ariaLabel = "References",
  showDisclosure = true,
  summaryContent,
  toolbar,
}: SourcesProps) {
  const instanceId = useId().replaceAll(":", "")
  const citationsById = new Map(
    items.map((item, index) => [
      item.id,
      {
        item,
        index,
        targetId: `citation-${instanceId}-${encodeURIComponent(item.id)}`,
      },
    ])
  )

  return (
    <CitationContext.Provider value={citationsById}>
      <div data-slot="sources" className={cn("space-y-6", className)}>
        <div data-slot="sources-content" className="leading-relaxed">
          {children}
        </div>
        {items.length > 0 && showDisclosure && (
          <div className="flex items-start justify-between gap-4">
            <details
              data-slot="sources-disclosure"
              className="group/citations"
            >
              <summary className="flex w-fit cursor-pointer list-none items-center gap-2 text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 text-accent-brand transition-transform group-open/citations:rotate-180"
                />
                {summaryContent ?? (
                  <span className="font-medium">
                    {items.length} {ariaLabel}
                  </span>
                )}
              </summary>
              <ol
                aria-label={ariaLabel}
                data-slot="sources-list"
                className="mt-3 flex flex-col items-start gap-2"
              >
                {items.map((item, index) => {
                  const targetId = citationsById.get(item.id)?.targetId
                  const href = getSafeHref(item.href)
                  const label = [item.title, item.source, item.locator]
                    .filter(Boolean)
                    .join(" - ")
                  const chipClassName =
                    "flex w-fit max-w-full items-center gap-2 rounded-full border border-border bg-background py-1 pl-3 pr-3 text-foreground"

                  return (
                    <li
                      key={item.id}
                      id={targetId}
                      tabIndex={-1}
                      data-slot="citation-item"
                      className="max-w-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <a
                        aria-label={`Reference ${index + 1}: ${label}`}
                        className={cn(
                          chipClassName,
                          "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        )}
                        href={href}
                        title={label}
                      >
                        <span
                          aria-hidden="true"
                          className={citationNumberClassName}
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0 truncate">{label}</span>
                      </a>
                    </li>
                  )
                })}
              </ol>
            </details>
            {toolbar}
          </div>
        )}
      </div>
    </CitationContext.Provider>
  )
}

function CitationReference({
  citationId,
  className,
}: CitationReferenceProps) {
  const citationsById = useContext(CitationContext)
  const citation = citationsById?.get(citationId)

  if (!citation) return null

  return (
    <sup data-slot="citation-reference" className="ml-0.5 align-super">
      <a
        aria-label={`Source ${citation.index + 1}: ${citation.item.title}`}
        className={cn(
          citationNumberClassName,
          "underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          className
        )}
        href={`#${citation.targetId}`}
      >
        {citation.index + 1}
      </a>
    </sup>
  )
}

export { Sources, CitationReference }
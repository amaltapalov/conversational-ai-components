/**
 * Capability Intro
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */
import { useId, type ComponentProps, type ReactNode } from "react"
import { cn } from "cn"

import {
  Suggestions,
  type SuggestionItem,
} from "@/components/xds/suggestions"

export type CapabilityItem = {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  starters?: SuggestionItem[]
}

export type CapabilityIntroStartersLayout = "flat" | "grouped"

export type CapabilityIntroProps = Omit<ComponentProps<"section">, "title"> & {
  title: string
  description?: string
  capabilities?: CapabilityItem[]
  starters?: SuggestionItem[]
  startersLayout?: CapabilityIntroStartersLayout
  onSelectStarter: (prompt: string) => void
  disabled?: boolean
  capabilitiesLabel?: string
  startersLabel?: string
}

const MAX_CAPABILITIES = 3

function CapabilityIntro({
  className,
  title,
  description,
  capabilities = [],
  starters,
  startersLayout = "flat",
  onSelectStarter,
  disabled = false,
  capabilitiesLabel = "What I can help with",
  startersLabel = "Try one of these",
  children,
  ...props
}: CapabilityIntroProps) {
  const id = useId()
  const titleId = `${id}-title`
  const capabilitiesId = `${id}-capabilities`
  const startersId = `${id}-starters`
  const isGrouped = startersLayout === "grouped"
  const visibleCapabilities = capabilities.slice(0, MAX_CAPABILITIES)
  const flatStarters =
    starters ??
    visibleCapabilities.flatMap((capability) => capability.starters ?? [])

  return (
    <section
      aria-labelledby={titleId}
      data-slot="capability-intro"
      data-layout={startersLayout}
      className={cn("flex w-full flex-col gap-8", className)}
      {...props}
    >
      <header data-slot="capability-intro-header" className="space-y-2">
        <h2
          id={titleId}
          data-slot="capability-intro-title"
          className="text-3xl font-bold"
        >
          {title}
        </h2>
        {description && (
          <p
            data-slot="capability-intro-description"
            className="text-muted-foreground"
          >
            {description}
          </p>
        )}
      </header>

      {visibleCapabilities.length > 0 && (
        <div data-slot="capability-intro-capabilities" className="space-y-2">
          <h3
            id={capabilitiesId}
            className="text-sm font-medium text-muted-foreground"
          >
            {capabilitiesLabel}
          </h3>
          <ul
            aria-labelledby={capabilitiesId}
            className={cn(
              "grid sm:grid-cols-3",
              isGrouped ? "gap-2" : "gap-x-4 gap-y-2"
            )}
          >
            {visibleCapabilities.map((capability) => (
              <li
                key={capability.id}
                data-slot="capability-intro-capability"
                className={cn(
                  "flex min-w-0 flex-col gap-1",
                  isGrouped && "border border-border bg-card p-3"
                )}
              >
                <p className="flex items-center gap-2 text-sm font-medium">
                  {capability.icon && (
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-accent-brand [&_svg]:size-4"
                    >
                      {capability.icon}
                    </span>
                  )}
                  {capability.title}
                </p>
                {capability.description && (
                  <p className="text-xs text-muted-foreground">
                    {capability.description}
                  </p>
                )}
                {isGrouped && (
                  <Suggestions
                    ariaLabel={`${startersLabel}: ${capability.title}`}
                    className="mt-auto pt-2 *:h-auto *:min-h-7 *:max-w-full *:py-1 *:text-left *:whitespace-normal"
                    disabled={disabled}
                    items={capability.starters ?? []}
                    onSelect={onSelectStarter}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isGrouped && flatStarters.length > 0 && (
        <div data-slot="capability-intro-starters" className="space-y-2">
          <h3
            id={startersId}
            className="text-sm font-medium text-muted-foreground"
          >
            {startersLabel}
          </h3>
          <Suggestions
            ariaLabel={startersLabel}
            disabled={disabled}
            items={flatStarters}
            onSelect={onSelectStarter}
          />
        </div>
      )}

      {children}
    </section>
  )
}

export { CapabilityIntro }

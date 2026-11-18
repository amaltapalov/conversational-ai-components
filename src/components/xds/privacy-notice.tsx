/**
 * Privacy Notice
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */
import { useId, useState, type ComponentProps, type ReactNode } from "react"
import {
  ChevronDown,
  Clock,
  Database,
  Share2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/xds/button"
import { getSafeHref } from "@/lib/utils"

export type PrivacyNoticeVariant = "composer" | "embedded" | "inline"

export type PrivacyTopic = "use" | "retention" | "sharing"

export type PrivacyNoticeItem = {
  topic: PrivacyTopic
  description: ReactNode
  /** Overrides the default label for the topic */
  label?: string
}

export type PrivacyNoticeProps = Omit<ComponentProps<"div">, "title"> & {
  variant?: PrivacyNoticeVariant
  /** One-line summary, e.g. "Chats are kept for 30 days." */
  title: ReactNode
  items?: PrivacyNoticeItem[]
  icon?: ReactNode
  policyHref?: string
  policyLabel?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  detailsLabel?: string
  ariaLabel?: string
}

const topicConfig: Record<PrivacyTopic, { icon: LucideIcon; label: string }> = {
  use: { icon: Database, label: "How it's used" },
  retention: { icon: Clock, label: "How long it's kept" },
  sharing: { icon: Share2, label: "Who it's shared with" },
}

function PrivacyNotice({
  variant = "composer",
  title,
  items = [],
  icon,
  policyHref,
  policyLabel = "Privacy policy",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  detailsLabel = "Learn more",
  ariaLabel = "Privacy notice",
  className,
  ...props
}: PrivacyNoticeProps) {
  const detailId = useId()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : internalOpen

  const safePolicyHref = policyHref ? getSafeHref(policyHref) : undefined
  const hasDetail = items.length > 0 || Boolean(safePolicyHref)

  function toggle() {
    const next = !isOpen
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div
      aria-label={ariaLabel}
      data-slot="privacy-notice"
      data-variant={variant}
      role="note"
      className={cn(
        "w-full text-sm text-muted-foreground",
        variant === "composer"
          ? "border border-t-0 border-border bg-muted px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
          : variant === "embedded"
            ? "bg-muted px-4 py-3 dark:bg-gray-900"
            : "border-l-2 border-border pl-3",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-2">
        <span
          data-slot="privacy-notice-icon"
          className="mt-0.5 flex shrink-0 [&_svg]:size-4"
        >
          {icon ?? <ShieldCheck aria-hidden="true" />}
        </span>
        <p data-slot="privacy-notice-title" className="min-w-0 flex-1">
          {title}
        </p>
        {hasDetail && (
          <Button
            aria-controls={detailId}
            aria-expanded={isOpen}
            className="-my-0.5 shrink-0"
            data-slot="privacy-notice-toggle"
            size="xs"
            type="button"
            variant="tertiary"
            onClick={toggle}
          >
            {detailsLabel}
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "transition-transform motion-reduce:transition-none",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        )}
      </div>
      {hasDetail && (
        <div
          data-slot="privacy-notice-detail"
          hidden={!isOpen}
          id={detailId}
          className="mt-2 space-y-3 pl-6 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
        >
          {items.length > 0 && (
            <dl className="space-y-2">
              {items.map((item, index) => {
                const { icon: TopicIcon, label } = topicConfig[item.topic]

                return (
                  <div
                    key={`${item.topic}-${index}`}
                    data-slot="privacy-notice-item"
                    data-topic={item.topic}
                  >
                    <dt className="flex items-center gap-1.5 font-medium text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0">
                      <TopicIcon aria-hidden="true" />
                      {item.label ?? label}
                    </dt>
                    <dd className="pl-5">{item.description}</dd>
                  </div>
                )
              })}
            </dl>
          )}
          {safePolicyHref && (
            <a
              data-slot="privacy-notice-policy"
              href={safePolicyHref}
              className="inline-block font-medium text-foreground underline underline-offset-4 outline-none hover:text-accent-brand focus-visible:ring-2 focus-visible:ring-ring"
            >
              {policyLabel}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export { PrivacyNotice }

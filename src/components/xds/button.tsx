import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "cn"

/**
 * Button
 * XDS — Experience Design System
 * Version: 0.1.0
 * Owner: DD&IT Experience & Adoption
 */

const buttonVariantStyles = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-accent-brand hover:text-accent-brand-foreground",
        outline:
          "border border-border bg-background hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "border border-border bg-background hover:bg-muted hover:text-accent-brand hover:border-accent-brand aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        tertiary:
          "hover:bg-muted hover:text-accent-brand aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent-brand",
      },
      size: {
        default:
          "h-10 gap-2 px-4",
        xs: "h-6 gap-1 px-2 text-xs in-data-[slot=button-group]:rounded-none [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 text-sm in-data-[slot=button-group]:rounded-none [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-1.5 px-4",
        icon: "size-10",
        "icon-xs":
          "size-6  in-data-[slot=button-group]:rounded-none [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8  in-data-[slot=button-group]:rounded-none",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

type ButtonVariantsProps = VariantProps<typeof buttonVariantStyles>

const buttonVariants = (props?: Parameters<typeof buttonVariantStyles>[0]) =>
  cn(buttonVariantStyles(props))

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & ButtonVariantsProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export { Button, buttonVariants }

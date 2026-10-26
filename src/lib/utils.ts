export { cn } from 'cn'

export function getSafeHref(href: string) {
  try {
    const url = new URL(href, "https://xds.invalid")
    if (url.protocol === "http:" || url.protocol === "https:") return href
  } catch {
    throw new TypeError("Link href must be a valid HTTP(S) or relative URL.")
  }

  throw new TypeError("Link href must be a valid HTTP(S) or relative URL.")
}

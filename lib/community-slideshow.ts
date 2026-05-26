import fs from "node:fs"
import path from "node:path"

const SLIDESHOW_DIR = path.join(process.cwd(), "public", "slideshow")
const IMAGE_EXT = /\.(avif|gif|jpe?g|png|webp)$/i

/** All images in `public/slideshow/` — add files there, then refresh dev server. */
export function getCommunitySlideshowImages(): string[] {
  if (!fs.existsSync(SLIDESHOW_DIR)) return []

  return fs
    .readdirSync(SLIDESHOW_DIR)
    .filter((name) => IMAGE_EXT.test(name) && !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => `/slideshow/${name}`)
}

function offsetRowOrder(images: string[], offset: number): string[] {
  const n = images.length
  if (n === 0) return []
  const o = ((offset % n) + n) % n
  return [...images.slice(o), ...images.slice(0, o)]
}

export function getCommunitySlideshowRowB(images: string[]): string[] {
  if (images.length < 2) return images
  return offsetRowOrder(images, Math.ceil(images.length / 3))
}

/** Client-side: downscale a photo to a JPEG data URL so uploads stay small. */
export async function compressImageFile(file: File, maxDimension = 1200, quality = 0.82): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.")
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error("Image must be under 20 MB.")
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error("This browser can't read that image format. Try a JPG or PNG.")
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not process image.")

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return canvas.toDataURL("image/jpeg", quality)
}

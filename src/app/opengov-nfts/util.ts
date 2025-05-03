// Function to resolve placeholders
export function resolvePlaceholders(
  text: string,
  previewData: Record<string, any>
) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = previewData[key]
    return value !== undefined ? String(value) : match
  })
}

export function highlightText(text: string, query: string) {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query})`, 'gi')
  return text
    .split(regex)
    .map((part) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return `<mark class="bg-yellow-200 rounded-sm">${part}</mark>`
      }
      return part
    })
    .join('')
}

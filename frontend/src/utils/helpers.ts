/**
 * Decode HTML entities in a string
 * @param str String containing HTML entities
 * @returns Decoded string
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  
  const textArea = document.createElement('textarea');
  textArea.innerHTML = str;
  return textArea.value;
}

/**
 * Get a color based on score percentage
 * @param percentage Score percentage (0-100)
 * @returns CSS color string
 */
export function getScoreColor(percentage: number): string {
  if (percentage < 40) {
    return '#dc3545'; // Red
  } else if (percentage < 70) {
    return '#ffc107'; // Yellow
  } else {
    return '#28a745'; // Green
  }
}

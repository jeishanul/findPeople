/**
 * First letter of up to the first two words of a name, upper-cased — used
 * for avatar initials wherever we don't have a photo (session avatar,
 * dashboard tables).
 */
export function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('')
}

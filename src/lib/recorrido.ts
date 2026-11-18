export const historyKey = 'portfolio:recorrido:v1';

export function readVisits(): string[] {
  const value: unknown = JSON.parse(localStorage.getItem(historyKey) ?? '[]');
  if (!Array.isArray(value) || !value.every(slug => typeof slug === 'string')) {
    throw new Error('Formato de recorrido no válido');
  }
  return [...new Set<string>(value)].slice(0, 5);
}

export function recordVisit(slug: string) {
  const recent = [slug, ...readVisits().filter(previous => previous !== slug)];
  localStorage.setItem(historyKey, JSON.stringify(recent.slice(0, 5)));
}

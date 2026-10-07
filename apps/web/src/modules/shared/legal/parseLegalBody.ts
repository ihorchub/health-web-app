export type LegalBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string };

/** Split API `body` into headings (`## …`) and paragraphs (blank-line separated). */
export const parseLegalBody = (body: string): LegalBlock[] => {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith('## ')) {
        return { type: 'heading' as const, text: chunk.slice(3).trim() };
      }

      return { type: 'paragraph' as const, text: chunk.replace(/\n/g, ' ') };
    });
};

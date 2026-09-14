/** Pick doctor bio for active app language; fallback to the other if empty. */
export const pickLocalizedDescription = (
  descriptionUk: string,
  descriptionEn: string,
  language: string,
): string => {
  const isEn = language.toLowerCase().startsWith('en');
  const primary = (isEn ? descriptionEn : descriptionUk).trim();
  const fallback = (isEn ? descriptionUk : descriptionEn).trim();
  return primary || fallback;
};

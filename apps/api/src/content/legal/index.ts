import { privacyDocuments, type LegalLocale } from "./privacy.js";
import { termsDocuments } from "./terms.js";

const resolveLang = (lang?: string): LegalLocale =>
  lang?.toLowerCase().startsWith("uk") ? "uk" : "en";

export const getPrivacyDocument = (lang?: string) => {
  const locale = resolveLang(lang);
  return { lang: locale, ...privacyDocuments[locale] };
};

export const getTermsDocument = (lang?: string) => {
  const locale = resolveLang(lang);
  return { lang: locale, ...termsDocuments[locale] };
};

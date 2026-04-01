/**
 * Minimal i18n utility for Ortenix (FR/EN)
 * Usage:
 *   import { t, getLang } from '../utils/i18n';
 *   const lang = getLang(Astro.url);
 *   const label = t('nav.expertise', lang);
 */

export type Lang = 'fr' | 'en';

const translations: Record<string, Record<Lang, string>> = {
  // Navigation
  'nav.expertise':   { fr: 'Expertises',     en: 'Expertise' },
  'nav.sectors':     { fr: 'Secteurs',        en: 'Sectors' },
  'nav.offer':       { fr: 'Offre',           en: 'Offer' },
  'nav.references':  { fr: 'Références',      en: 'References' },
  'nav.team':        { fr: "L'équipe",        en: 'Team' },
  'nav.contact':     { fr: 'Contact',         en: 'Contact' },

  // CTAs
  'cta.quote':       { fr: 'Devis 48h',       en: 'Quote 48h' },
  'cta.discuss':     { fr: 'Discutons de votre projet', en: 'Discuss your project' },
  'cta.discover':    { fr: 'Nos secteurs ↓',  en: 'Our sectors ↓' },

  // Hero
  'hero.tagline.en': { fr: 'We build certainty.',      en: 'We build certainty.' },
  'hero.tagline.fr': { fr: 'Nous construisons la certitude.', en: 'Nous construisons la certitude.' },
  'hero.badge':      { fr: "Bureau d'études · Offshore · Naval · Énergie · Nucléaire",
                       en: 'Engineering firm · Offshore · Naval · Energy · Nuclear' },

  // Contact
  'contact.title':   { fr: 'Échange confidentiel sous 48h', en: 'Confidential exchange within 48h' },
  'contact.nda':     { fr: 'NDA systématique sur demande — Confidentialité garantie',
                       en: 'Systematic NDA on request — Guaranteed confidentiality' },

  // Sectors
  'sector.offshore': { fr: 'Offshore',    en: 'Offshore' },
  'sector.naval':    { fr: 'Naval',       en: 'Naval' },
  'sector.energie':  { fr: 'Énergie',     en: 'Energy' },
  'sector.nuke':     { fr: 'Nucléaire',   en: 'Nuclear' },

  // Common
  'common.more':     { fr: 'En savoir plus', en: 'Learn more' },
  'common.back':     { fr: '← Accueil',      en: '← Home' },
  'common.nda':      { fr: 'NDA systématique', en: 'Systematic NDA' },
};

/**
 * Get translation for a key in the given language.
 * Falls back to French if key not found.
 */
export function t(key: string, lang: Lang = 'fr'): string {
  const entry = translations[key];
  if (!entry) {
    console.warn(`[i18n] Missing translation key: "${key}"`);
    return key;
  }
  return entry[lang] ?? entry['fr'];
}

/**
 * Detect language from URL path.
 * /en/... → 'en', everything else → 'fr'
 */
export function getLang(url: URL): Lang {
  return url.pathname.startsWith('/en') ? 'en' : 'fr';
}

/**
 * Get the alternate language URL for the current page.
 * /fr-page → /en/fr-page and vice-versa.
 */
export function getAltLangUrl(url: URL): string {
  const lang = getLang(url);
  if (lang === 'en') {
    // Remove /en prefix
    return url.pathname.replace(/^\/en/, '') || '/';
  } else {
    // Add /en prefix
    return `/en${url.pathname}`;
  }
}

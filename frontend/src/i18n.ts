import { useSyncExternalStore } from "react";
/**
 * Interface languages. Spanish is the source language: the Spanish text is
 * the key, so `tr("Biblioteca")` returns it unchanged in Spanish and looks it
 * up in locales/en.json in English. A missing English entry falls back to the
 * Spanish text instead of showing a key.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

export const LANGUAGES = ["es", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = "twinauta.language.v2";

function initialLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    // Storage can be blocked; start in the default language.
  }
  return "en";
}

void i18n.use(initReactI18next).init({
  resources: { es: { translation: {} }, en: { translation: en } },
  lng: initialLanguage(),
  fallbackLng: "es",
  // Keys are full sentences: dots and colons are part of the text.
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});

function applyDocumentLanguage(language: string) {
  document.documentElement.lang = language;
}
applyDocumentLanguage(i18n.language);
i18n.on("languageChanged", applyDocumentLanguage);

/** Current interface language. */
export function currentLanguage(): Language {
  return i18n.language === "en" ? "en" : "es";
}

/** Switch language and remember the choice in this browser. */
export function setLanguage(language: Language): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Not remembering is acceptable.
  }
  void i18n.changeLanguage(language);
}

/**
 * Translate an interface text. Called during render; App subscribes to
 * language changes, so the whole tree re-renders with the new language.
 */
export function tr(
  text: string,
  values?: Record<string, string | number>,
): string {
  if (!text) return text;
  if (currentLanguage() === "es")
    return i18n.t(text, { ...values, lng: "es", defaultValue: text });
  if (i18n.exists(text, { lng: "en" })) return i18n.t(text, values);
  for (const [pattern, key] of DISPLAY_PATTERNS) {
    const match = text.match(pattern);
    if (match)
      return i18n.t(
        key,
        Object.fromEntries(
          match.slice(1).map((value, index) => ["value" + index, tr(value)]),
        ),
      );
  }
  const sentences = text.split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÑ])/u);
  return sentences.length > 1
    ? sentences.map((sentence) => tr(sentence)).join(" ")
    : text;
}

/**
 * Mark a text defined outside render (module constants) for translation. It
 * returns the Spanish text unchanged; translate it where it is shown with
 * `tr(value)`.
 */
export function msg(text: string): string {
  return text;
}

/**
 * Label maps keep their Spanish values in code and are translated on access,
 * so `LABELS[id]` always returns the current language.
 */
export function translated<T extends Record<string, string>>(record: T): T {
  return new Proxy(record, {
    get(target, key, receiver) {
      const value: unknown = Reflect.get(target, key, receiver);
      return typeof value === "string" ? i18n.t(value) : value;
    },
  });
}

export default i18n;

/** Subscribe without remounting screens or resetting their state. */
const subscribeLanguage = (notify: () => void) => {
  i18n.on("languageChanged", notify);
  return () => {
    i18n.off("languageChanged", notify);
  };
};
export function useLanguage(): Language {
  return useSyncExternalStore(subscribeLanguage, currentLanguage, () => "es");
}
/** Format a value with the selected interface locale. */
export function formatNumber(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString(currentLanguage(), { maximumFractionDigits });
}

// Only documented application templates are localized. Source excerpts and
// scientific titles are never rewritten or machine-translated.
const DISPLAY_PATTERNS: readonly [RegExp, string][] = [
  [/^Detalle técnico: (.*)$/, "Detalle técnico: {{value0}}"],
  [
    /^El servicio respondió con estado (\d+)\.$/,
    "El servicio respondió con estado {{value0}}.",
  ],
  [
    /^Caso ilustrativo: (\d+) valores disponibles y (\d+) registros por revisar\. No se infiere pérdida muscular ni riesgo clínico\.$/,
    "Caso ilustrativo: {{value0}} valores disponibles y {{value1}} registros por revisar. No se infiere pérdida muscular ni riesgo clínico.",
  ],
  [
    /^La sesión del día (\d+) no tiene registro; puede haberse realizado\.$/,
    "La sesión del día {{value0}} no tiene registro; puede haberse realizado.",
  ],
  [/^Falta una evaluación de (.+)\.$/, "Falta una evaluación de {{value0}}."],
  [
    /^Faltan valores disponibles para: (.+)\.$/,
    "Faltan valores disponibles para: {{value0}}.",
  ],
  [
    /^No hay un basal individual declarado para: (.+)\.$/,
    "No hay un basal individual declarado para: {{value0}}.",
  ],
  [
    /^Las últimas evaluaciones de (.+) no son comparables\.$/,
    "Las últimas evaluaciones de {{value0}} no son comparables.",
  ],
];

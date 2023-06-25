import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';
import { enUS, pl, ru, uk } from 'date-fns/locale'

import message_en from "i18n/locales/en/message.json";
import message_pl from "i18n/locales/pl/message.json";
import message_ru from "i18n/locales/ru/message.json";
import message_uk from "i18n/locales/uk/message.json";

// Do not forget to add languages to src/api/settings.ts

const LANGUAGE_RESOURCES = {
    en: {
        message: message_en
    },
    pl: {
        message: message_pl
    },
    ru: {
        message: message_ru
    },
    uk: {
        message: message_uk
    }
};

const LANGUAGES_SUPPORTED: string[] = ["en", "pl", "ru", "uk"];

const DATE_FNS_LOCALES: Partial<Record<string, Locale>> = {
    "en": enUS,
    "pl": pl,
    "ru": ru,
    "uk": uk
}

export function findPreferredLanguage(): string {
    for (const language of navigator.languages) {
        const lang = language.toLowerCase();
        if (LANGUAGES_SUPPORTED.includes(lang)) {
            return lang;
        }
        const closest = LANGUAGES_SUPPORTED.find(av => lang.startsWith(av + "-"));
        if (closest != null) {
            return closest;
        }
    }
    return "en";
}

export function getDateFnsLocale(): Locale {
    return DATE_FNS_LOCALES[i18n.language] ?? enUS;
}

export function tGender(gender: string | null | undefined): string {
    return gender != null ? gender.toLowerCase() : "";
}

i18n.use(initReactI18next)
    .use(ICU)
    .init({
        resources: LANGUAGE_RESOURCES,
        lng: findPreferredLanguage(),
        fallbackLng: "en",
        supportedLngs: LANGUAGES_SUPPORTED,
        ns: ['message'],
        defaultNS: 'message',
        interpolation: {
            escapeValue: false, // not needed for React as it escapes by default
        }
    });

export default i18n;

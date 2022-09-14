import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';

import message_en from "i18n/locales/en/message.json";
import message_ru from "i18n/locales/ru/message.json";

const resources = {
    en: {
        message: message_en
    },
    ru: {
        message: message_ru
    }
};

i18n.use(initReactI18next)
    .use(ICU)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        supportedLngs: ["en", "ru"],
        ns: ['message'],
        defaultNS: 'message',
        interpolation: {
            escapeValue: false, // not needed for React as it escapes by default
        }
    });

export default i18n;

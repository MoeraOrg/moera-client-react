import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import message_en from "i18n/locales/en/message.json";

const resources = {
    en: {
        message: message_en
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en"],
    ns: ['message'],
    defaultNS: 'message',
    interpolation: {
        escapeValue: false, // not needed for React as it escapes by default
    }
});

export default i18n;

import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

import translationEN from './lang/en.json';
import translationBN from './lang/bn.json';

const preferredLanguage = localStorage.getItem('preferredLanguage');

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  bn: {
    translation: translationBN
  }
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: preferredLanguage,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
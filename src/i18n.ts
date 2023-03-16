import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import HttpBackend from 'i18next-http-backend';
import moment from 'moment';
import { initReactI18next } from 'react-i18next';

import { getLocalStorage } from 'common/services/common/storage';
import en from 'common/translations/en.json';
import vi from 'common/translations/vi.json';
import LOCAL_STORAGE from 'common/utils/constant';

export const getCurrentLanguage = () => getLocalStorage(LOCAL_STORAGE.LANGUAGE) || 'vi';

export const i18ChangeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  // window.location.reload();
  moment.locale(language);
};

i18n
  .use(initReactI18next)
  // .use(HttpBackend)
  .use(new LanguageDetector(null, { lookupLocalStorage: LOCAL_STORAGE.LANGUAGE }))
  .init({
    fallbackLng: 'vi',
    lng: getCurrentLanguage(),
    resources: {
      vi: {
        translation: vi,
      },
      en: {
        translation: en
      }
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
    // backend: {
    //   loadPath: `${process.env.REACT_APP_API_BASE_URL}cms-translations/for-fe?locale={{lng}}`,
    // },
    //! Only turn this defaultNS on when testing local static translation files
    // defaultNS: 'local',
  });

export default i18n;

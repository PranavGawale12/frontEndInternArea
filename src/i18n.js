import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LangauageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    .use(LangauageDetector)
    .use(initReactI18next)
    .init({
        fallbacklng:'en',
        debug:true,
        ns:['register','footer','home','job','intern','internDetail','jobDetail','navbar','sidebar','UserApplication'],
        defaultNS:'home',
        detection:{
            order:['path','cookie','htmlTag'],
            caches:['cookie'],
        },
        backend:{
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        interpolation:{
            escapeValue: false,
        },
        react:{
            useSuspense: false,
        }
    });

export default i18n;

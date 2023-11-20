import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { english } from "./en";
import { chinese } from "./cn";
import { malayu } from "./my";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translations: english },
            cn: { translations: chinese },
            my: { translations: malayu }
        },
        fallbackLng: "en",
        debug: false,

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

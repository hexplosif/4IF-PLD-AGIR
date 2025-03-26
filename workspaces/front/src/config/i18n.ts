import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18next
  .use(HttpBackend)  // Thay thế resourcesToBackend
  .use(initReactI18next)
  .init({
    returnObjects: true,
    fallbackLng: "en",
    debug: true,
    lng: "en",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Đường dẫn tới file JSON
    },
  });

export { i18next };

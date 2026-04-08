import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { "Coinphora": "Coinphora", "Customer Support": "Customer Support", "Translate": "Translate" } },
  es: { translation: { "Coinphora": "Coinphora", "Customer Support": "Soporte al cliente", "Translate": "Traducir" } },
  fr: { translation: { "Coinphora": "Coinphora", "Customer Support": "Support client", "Translate": "Traduire" } },
  de: { translation: { "Coinphora": "Coinphora", "Customer Support": "Kundendienst", "Translate": "Übersetzen" } },
  zh: { translation: { "Coinphora": "Coinphora", "Customer Support": "客户支持", "Translate": "翻译" } },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;

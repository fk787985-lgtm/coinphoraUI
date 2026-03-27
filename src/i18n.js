import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { "OnChainBitTles": "OnChainBitTles", "Customer Support": "Customer Support", "Translate": "Translate" } },
  es: { translation: { "OnChainBitTles": "OnChainBitTles", "Customer Support": "Soporte al cliente", "Translate": "Traducir" } },
  fr: { translation: { "OnChainBitTles": "OnChainBitTles", "Customer Support": "Support client", "Translate": "Traduire" } },
  de: { translation: { "OnChainBitTles": "OnChainBitTles", "Customer Support": "Kundendienst", "Translate": "Übersetzen" } },
  zh: { translation: { "OnChainBitTles": "OnChainBitTles", "Customer Support": "客户支持", "Translate": "翻译" } },
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

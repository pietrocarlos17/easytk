import { createContext, useContext, useState, useCallback } from "react";
import pt from "./pt";
import en from "./en";

const translations = { pt, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("pt");

  const t = useCallback((key) => {
    const keys = key.split(".");
    let value = translations[lang];
    for (const k of keys) {
      if (value == null) return key;
      value = value[k];
    }
    return value ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ t, lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}

'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type Lang = 'CAS' | 'CAT' | 'ENG';

const LS_KEY = 'izanos-lang';
const VALID: Lang[] = ['CAS', 'CAT', 'ENG'];

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; }

const LangContext = createContext<LangCtx>({ lang: 'CAS', setLang: () => {} });

export function useLanguage() { return useContext(LangContext); }

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('CAS');

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY) as Lang | null;
    if (stored && VALID.includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LS_KEY, l);
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

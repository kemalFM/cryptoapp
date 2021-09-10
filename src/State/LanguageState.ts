import create from 'zustand';

type LanguageStateType = {
  language: 'de' | 'en';
  setLanguage: (language: 'en' | 'de') => void;
};

export const useLanguageState = create<LanguageStateType>(set => ({
  language: 'de',
  setLanguage: language => set({language}),
}));

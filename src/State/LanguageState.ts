import create from 'zustand';
import {languageList} from '../I18N/I18N';

type LanguageStateType = {
  language: languageList;
  setLanguage: (language: languageList) => void;
};

export const useLanguageState = create<LanguageStateType>(set => ({
  language: 'en',
  setLanguage: language => set({language}),
}));

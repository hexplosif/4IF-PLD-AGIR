import { Language } from "@shared/common/Languages";
import drapeau_fr from '@app/assets/icons/drapeau_fr.webp';
import drapeau_en from '@app/assets/icons/drapeau_en.webp';
import drapeau_es from '@app/assets/icons/drapeau_es.webp';
import drapeau_de from '@app/assets/icons/drapeau_de.webp';


export const LANGUAGES: Language[] = [Language.ENGLISH, Language.FRENCH, Language.SPANISH, Language.GERMAN];
export const LANGUAGES_INFO = {
    [Language.ENGLISH]: {
        code: "EN",
        name: 'English',
        img: drapeau_en,
    },
    [Language.FRENCH]: {
        code: "FR",
        name: 'Français',
        img: drapeau_fr,
    },
    [Language.SPANISH]: {
        code: "ES",
        name: 'Español',
        img: drapeau_es,
    },
    [Language.GERMAN]: {
        code: "DE",
        name: 'Deutsch',
        img: drapeau_de,
    },
};

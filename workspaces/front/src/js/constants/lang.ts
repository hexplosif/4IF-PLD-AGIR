import { Language } from "@shared/common/Languages";
import drapeau_fr from '@app/assets/icons/drapeau_fr.webp';
import drapeau_en from '@app/assets/icons/drapeau_en.webp';


export const LANGUAGES: Language[] = [Language.ENGLISH, Language.FRENCH];
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
    }
}

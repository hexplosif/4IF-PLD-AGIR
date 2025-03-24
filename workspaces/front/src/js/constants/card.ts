import { Actor } from "@shared/common/Cards";
import { Language } from "@shared/common/Languages";

export const LANGUAGES_STRING_MAP : Record<Language, string> = {
    [Language.ENGLISH]: 'English',
    [Language.FRENCH]: 'Français',
}

export const ACTOR_VALUES : Record<Language, Record<Actor, string>> = {
    [Language.FRENCH]: {
        [Actor.ARCHITECT] : 'Architecte',
        [Actor.DEVELOPER] : 'Développeur',
        [Actor.PRODUCT_OWNER] : 'Product Owner',
    },
    [Language.ENGLISH]: {
        [Actor.ARCHITECT] : 'Architect',
        [Actor.DEVELOPER] : 'Developer',
        [Actor.PRODUCT_OWNER] : 'Product Owner',
    }
};
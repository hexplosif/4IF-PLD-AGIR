import { Actor } from "@shared/common/Cards";
import { Language } from "@shared/common/Languages";

export const LANGUAGES_STRING_MAP: Record<Language, string> = {
    [Language.ENGLISH]: 'English',
    [Language.FRENCH]: 'Français',
    [Language.SPANISH]: 'Español',
    [Language.GERMAN]: 'Deutsch',
    [Language.PORTUGUESE]: 'Português',
}

export const ACTOR_VALUES: Record<Language, Record<Actor, string>> = {
    [Language.FRENCH]: {
        [Actor.ARCHITECT]: 'Architecte',
        [Actor.DEVELOPER]: 'Développeur',
        [Actor.PRODUCT_OWNER]: 'Product Owner',
    },
    [Language.ENGLISH]: {
        [Actor.ARCHITECT]: 'Architect',
        [Actor.DEVELOPER]: 'Developer',
        [Actor.PRODUCT_OWNER]: 'Product Owner',
    },
    [Language.SPANISH]: {
        [Actor.ARCHITECT]: 'Arquitecto',
        [Actor.DEVELOPER]: 'Desarrollador',
        [Actor.PRODUCT_OWNER]: 'Propietario del producto',
    },
    [Language.GERMAN]: {
        [Actor.ARCHITECT]: 'Architekt',
        [Actor.DEVELOPER]: 'Entwickler',
        [Actor.PRODUCT_OWNER]: 'Produktbesitzer',
    },
    [Language.PORTUGUESE]: {
        [Actor.ARCHITECT]: 'Arquiteto',
        [Actor.DEVELOPER]: 'Desenvolvedor',
        [Actor.PRODUCT_OWNER]: 'Proprietário do produto',
    },
};
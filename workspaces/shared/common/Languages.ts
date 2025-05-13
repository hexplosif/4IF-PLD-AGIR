export enum Language {
    ENGLISH = 'en',
    FRENCH = 'fr',
    SPANISH = 'es',
    GERMAN = 'de',
    PORTUGUESE = 'pt',
}

export const getLanguage = (language: string): Language => {
    const l = language.toLowerCase();
    switch (l) {
        case 'fr':
            return Language.FRENCH;
        case 'en':
            return Language.ENGLISH;
        case 'es':
            return Language.SPANISH;
        case 'de':
            return Language.GERMAN;
        case 'pt':
            return Language.PORTUGUESE;
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}

export const getLanguageFullText = (language: string): string => {
    const l = language.toLowerCase();
    switch (l) {
        case 'fr':
            return "Français (FR)";
        case 'en':
            return "English (EN)";
        case 'es':
            return "Español (ES)";
        case 'de':
            return "Deutsch (DE)";
        case 'pt':
            return "Português (PT)";
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}
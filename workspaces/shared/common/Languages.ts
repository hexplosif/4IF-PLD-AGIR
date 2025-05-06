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
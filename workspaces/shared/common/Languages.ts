export enum Language {
    ENGLISH = 'en',
    FRENCH = 'fr',
    SPANISH = 'es',
    GERMAN = 'de',
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
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}
export enum Language {
    ENGLISH = 'en',
    FRENCH = 'fr',
}

export const getLanguage = (language: string): Language => {
    const l = language.toLowerCase();
    switch (l) {
        case 'fr':
            return Language.FRENCH;
        case 'en':
            return Language.ENGLISH;
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}
import { Formation_Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card, Actor, MultipleContentsBestPracticeCard, MultipleContentsBadPracticeCard, MultipleContentsExpertCard, MultipleContentsFormationCard } from "@shared/common/Cards";
import { Actor as ActorEntity } from "@app/entity/actor";
import { Best_Practice_Card as EntityBestPractice } from "@app/entity/best_practice_card";
import { Bad_Practice_Card as EntityBadPractice } from "@app/entity/bad_practice_card";
import { Training_Card as EntityTraining } from "@app/entity/training_card";
import { Expert_Card as Expert_Card_Entity } from "@app/entity/expert_card";
import { Language } from "@shared/common/Languages";
import { Card_Content } from "@app/entity/card_content";

export const mappingBestPracticeCard = (card: EntityBestPractice, lang: Language): Best_Practice_Card => {
    if (!card) return null;
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);

    return {
        id: card.id.toString(),
        actor: actor?.type,
        title: content?.label || "No title",
        contents: content?.description || "No description",
        resume: content?.resume || content?.description || "No description",
        cardType: "BestPractice",
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
        carbon_loss: card.carbon_loss,
        interface_composant: card.interface_composant,
        data_composant: card.data_composant,
        network_composant: card.network_composant,
        performance_composant: card.performance_composant,
        system_composant: card.system_composant,
    }
}

export const mappingBadPracticeCard = (card: EntityBadPractice, lang: Language): Bad_Practice_Card => {
    if (!card) return null;
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor?.type,
        title: content?.label || "No title",
        contents: content?.description || "No description",
        resume: content?.resume || content?.description || "No description",
        cardType: "BadPractice",
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
        interface_composant: card.interface_composant,
        data_composant: card.data_composant,
        network_composant: card.network_composant,
        performance_composant: card.performance_composant,
        system_composant: card.system_composant,
    }
}

export const mappingTrainingCard = (card: EntityTraining, lang: Language): Formation_Card => {
    if (!card) return null;
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor?.type,
        title: content?.label || "No title",
        contents: content?.description || "No description",
        resume: content?.resume || content?.description || "No description",
        cardType: "Formation",
        linkToFormation: card.link,
    }
}

export const mappingExpertCard = (card: Expert_Card_Entity, lang: Language): Expert_Card => {
    if (!card) return null;
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor?.type,
        title: content?.label || "No title",
        contents: content?.description || "No description",
        resume: content?.resume || content?.description || "No description",
        cardType: "Expert",
    }
}

export const mappingMultiContentsBestPracticeCard = (card: EntityBestPractice): MultipleContentsBestPracticeCard => {
    if (!card) return null;

    console.log(card);

    return {
        id: card.id.toString(),
        cardType: "BestPractice",
        languageContents: getLanguageContents(card.contents, card.actors),
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
        carbon_loss: card.carbon_loss,
        interface_composant: card.interface_composant,
        data_composant: card.data_composant,
        network_composant: card.network_composant,
        performance_composant: card.performance_composant,
        system_composant: card.system_composant,
    }
}

export const mappingMultiContentsBadPracticeCard = (card: EntityBadPractice): MultipleContentsBadPracticeCard => {
    if (!card) return null;
    return {
        id: card.id.toString(),
        cardType: "BadPractice",
        languageContents: getLanguageContents(card.contents, card.actors),
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
        interface_composant: card.interface_composant,
        data_composant: card.data_composant,
        network_composant: card.network_composant,
        performance_composant: card.performance_composant,
        system_composant: card.system_composant,
    }
}

export const mappingMultiContentsExpertCard = (card: Expert_Card_Entity): MultipleContentsExpertCard => {
    if (!card) return null;
    return {
        id: card.id.toString(),
        cardType: "Expert",
        languageContents: getLanguageContents(card.contents, card.actors),
    }
}

export const mappingMultiContentsTrainingCard = (card: EntityTraining): MultipleContentsFormationCard => {
    if (!card) return null;
    return {
        id: card.id.toString(),
        cardType: "Formation",
        languageContents: getLanguageContents(card.contents, card.actors),
        linkToFormation: card.link,
    }
}

const getContentByLanguage = (contents: Card_Content[], lang: Language) => {
    if (!contents || contents.length === 0) return null;
    return contents.find(c => c.language === lang)
        || contents.find(c => c.language === Language.ENGLISH)
        || contents[0];
}

const getActorByLanguage = (actors: ActorEntity[], lang: Language) => {
    if (!actors || actors.length === 0) return null;
    return actors.find(a => a.language === lang)
        || actors.find(a => a.language === Language.ENGLISH)
        || actors[0];
}

const getLanguageContents = (contents: Card_Content[], actor: ActorEntity[]) => {
    if (!contents || contents.length === 0) return [];
    return contents.map(content => {
        const _actor = actor.find(a => a.language === content.language);
        return {
            language: content.language as Language,
            title: content.label,
            description: content.description,
            resume: content.resume || content.description,
            actorName: _actor.title,
            actorType: _actor.type,
        }
    });
}

export const getActorType = (actorTitle: string, lang: Language): Actor => {
    // Define actor titles by language
    const actorTitles = {
        [Language.FRENCH]: {
            "Architecte": Actor.ARCHITECT,
            "Développeur": Actor.DEVELOPER,
            "Responsable Produit": Actor.PRODUCT_OWNER
        },
        [Language.ENGLISH]: {
            "Architect": Actor.ARCHITECT,
            "Developer": Actor.DEVELOPER,
            "Product Owner": Actor.PRODUCT_OWNER
        },
        [Language.SPANISH]: {
            "Arquitecto": Actor.ARCHITECT,
            "Desarrollador": Actor.DEVELOPER,
            "Propietario del Producto": Actor.PRODUCT_OWNER
        },
        [Language.GERMAN]: {
            "Architekt": Actor.ARCHITECT,
            "Entwickler": Actor.DEVELOPER,
            "Produktverantwortlicher": Actor.PRODUCT_OWNER
        },
        [Language.PORTUGUESE]: {
            "Arquiteto": Actor.ARCHITECT,
            "Desenvolvedor": Actor.DEVELOPER,
            "Proprietário do Produto": Actor.PRODUCT_OWNER
        }
    };

    // Check if the language is supported
    if (!actorTitles[lang]) {
        console.error(`Unexpected language: ${lang}`);
        throw new Error(`Unexpected language: ${lang}`);
    }

    // Get actor type for the given title in the specified language
    const actorType = actorTitles[lang][actorTitle];
    if (!actorType) {
        console.error(`Unexpected actor title for ${lang}: ${actorTitle}`);
        throw new Error(`Unexpected actor title: ${actorTitle}`);
    }

    return actorType;
}

export const getLanguage = (language: string): Language => {
    switch (language) {
        case "fr":
            return Language.FRENCH;
        case "en":
            return Language.ENGLISH;
        case "es":
            return Language.SPANISH;
        case "de":
            return Language.GERMAN;
        case "pt":
            return Language.PORTUGUESE;
        default:
            throw new Error(`Unexpected language: ${language}`);
    }
}

export const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
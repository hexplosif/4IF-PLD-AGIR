import { Formation_Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card, Actor, MultipleContentsBestPracticeCard, MultipleContentsBadPracticeCard, MultipleContentsExpertCard, MultipleContentsFormationCard } from "@shared/common/Cards";
import { Actor as ActorEntity } from "@app/entity/actor";
import { Best_Practice_Card as EntityBestPractice } from "@app/entity/best_practice_card";
import { Bad_Practice_Card as EntityBadPractice } from "@app/entity/bad_practice_card";
import { Training_Card as EntityTraining } from "@app/entity/training_card";
import { Expert_Card as Expert_Card_Entity } from "@app/entity/expert_card";
import { Language } from "@shared/common/Languages";
import { Card_Content } from "@app/entity/card_content";

export const mappingBestPracticeCard = (card: EntityBestPractice, lang: Language) : Best_Practice_Card => {
    if (!card) return null;
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);

    return {
        id: card.id.toString(),
        actor: actor?.type,
        title: content?.label || "No title",
        contents: content?.description || "No description",
        cardType: "BestPractice",
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
        carbon_loss: card.carbon_loss,
    }
}

export const mappingBadPracticeCard = (card: EntityBadPractice, lang: Language) : Bad_Practice_Card => {
    if (!card) return null;
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor?.type,
        title: content?.label || "No title",
        contents: content?.description || "No description",
        cardType: "BadPractice",
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
    }
}

export const mappingTrainingCard = (card: EntityTraining, lang: Language) : Formation_Card => {
    if (!card) return null;
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor?.type,
        title: content?.label || "No title",
        contents: content?.description || "No description",
        cardType: "Formation",
        linkToFormation: card.link,
    }
}

export const mappingExpertCard = (card: Expert_Card_Entity, lang: Language) : Expert_Card => {
    if (!card) return null;
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor?.type,
        title: content?.label || "No title",
        contents: content?.description || "No description",
        cardType: "Expert",
    }
}

export const mappingMultiContentsBestPracticeCard = (card: EntityBestPractice) : MultipleContentsBestPracticeCard => {
    if (!card) return null;

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
    }
}

export const mappingMultiContentsBadPracticeCard = (card: EntityBadPractice) : MultipleContentsBadPracticeCard => {
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
    }
}

export const mappingMultiContentsExpertCard = (card: Expert_Card_Entity) : MultipleContentsExpertCard => {
    if (!card) return null;
    return {
        id: card.id.toString(),
        cardType: "Expert",
        languageContents: getLanguageContents(card.contents, card.actors),
    }
}

export const mappingMultiContentsTrainingCard = (card: EntityTraining) : MultipleContentsFormationCard => {
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
            actorName: _actor.title,
            actorType: _actor.type,
        }
    });
}

export const getActorType = (actorTitle: string): Actor => {
    switch (actorTitle) {
        case "Architecte":
            return Actor.ARCHITECT;
        case "Développeur":
            return Actor.DEVELOPER;
        case "Product Owner":
            return Actor.PRODUCT_OWNER;
        default:
            throw new Error(`Unexpected actor title: ${actorTitle}`);
    }
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
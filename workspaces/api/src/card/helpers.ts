import { Card, Formation_Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card, Actor } from "@shared/common/Cards";
import { Best_Practice_Card as EntityBestPractice } from "@app/entity/best_practice_card";
import { Bad_Practice_Card as EntityBadPractice } from "@app/entity/bad_practice_card";
import { Training_Card as EntityTraining } from "@app/entity/training_card";
import { Expert_Card as Expert_Card_Entity } from "@app/entity/expert_card";
import { Language } from "@shared/common/Languages";
import { Card_Content } from "@app/entity/card_content";

export const mappingBestPracticeCard = (card: EntityBestPractice, lang: Language) : Best_Practice_Card => {
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);

    return {
        id: card.id.toString(),
        actor: actor.type,
        title: content.label || "No title",
        contents: content.description || "No description",
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
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor.type,
        title: content.label || "No title",
        contents: content.description || "No description",
        cardType: "BadPractice",
        network_gain: card.network_gain,
        memory_gain: card.memory_gain,
        cpu_gain: card.cpu_gain,
        storage_gain: card.storage_gain,
        difficulty: card.difficulty,
    }
}

export const mappingTrainingCard = (card: EntityTraining, lang: Language) : Formation_Card => {
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor.type,
        title: content.label || "No title",
        contents: content.description || "No description",
        cardType: "Formation",
        linkToFormation: card.link,
    }
}

export const mappingExpertCard = (card: Expert_Card_Entity, lang: Language) : Expert_Card => {
    const content = getContentByLanguage(card.contents, lang);
    const actor = getActorByLanguage(card.actors, lang);
    return {
        id: card.id.toString(),
        actor: actor.type,
        title: content.label || "No title",
        contents: content.description || "No description",
        cardType: "Expert",
    }
}

const getContentByLanguage = (contents: Card_Content[], lang: Language) => {
    return contents.find(c => c.language === lang) 
        || contents.find(c => c.language === Language.ENGLISH)
        || contents[0];
}

const getActorByLanguage = (actors: any[], lang: Language) => {
    return actors.find(a => a.language === lang) 
        || actors.find(a => a.language === Language.ENGLISH)
        || actors[0];
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
        default:
          throw new Error(`Unexpected language: ${language}`);
    }
}
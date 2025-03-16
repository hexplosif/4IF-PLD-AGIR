import { Card } from "@shared/common/Cards";

const addCard = (card: Card) => {
    return fetch(`${import.meta.env.VITE_API_URL}/card/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...card, language: 'fr', actorType: card.actor})
    });
}

export {
    addCard
};
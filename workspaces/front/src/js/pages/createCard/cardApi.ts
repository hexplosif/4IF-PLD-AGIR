import { Card } from "@shared/common/Cards";

const addCard = (card: Card) => {
    return fetch(`${import.meta.env.VITE_API_URL}/card/add`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify({...card, language: 'fr', actorType: card.actor})
    });
}

export {
    addCard
};
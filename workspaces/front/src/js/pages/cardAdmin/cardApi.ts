import { ACTOR_VALUES } from "@app/js/constants/card";
import { Actor, Bad_Practice_Card, BaseCard, Best_Practice_Card, Card, EmptyCard, Expert_Card, Formation_Card, MultipleContentsCard } from "@shared/common/Cards";
import { Language } from "@shared/common/Languages";

const addCard = (card: MultipleContentsCard) => {
    return fetch(`${import.meta.env.VITE_API_URL}/card/add`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(card),
    });
}

const updateCard = (card: MultipleContentsCard) => {
    return fetch(`${import.meta.env.VITE_API_URL}/card/update`, {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(card),
    });
}

const getCardById = (id: string) => {
    return fetch(`${import.meta.env.VITE_API_URL}/card/id/${id}`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
    });
}
  
  
export {
    addCard,
    updateCard,
    getCardById,
};



import { MultipleContentsCard } from "@shared/common/Cards";

const addCard = (card: MultipleContentsCard) => {
    console.log(card);
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
    console.log(card);
    return fetch(`${import.meta.env.VITE_API_URL}/card/update`, {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(card),
    });
}

const chargeCsv = (file: File) => {
    var data = new FormData()
    data.append('csvFile', file)

    return fetch(`${import.meta.env.VITE_API_URL}/card/csv`, {
        method: 'POST',
        headers: new Headers({
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
        body: data,
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
    chargeCsv,
    getCardById,
};



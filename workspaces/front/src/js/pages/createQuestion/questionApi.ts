export const addQuestion = (question: QuestionProps) => {
    return fetch(`${import.meta.env.VITE_API_URL}/sensibilisation/add`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(question),
    });
}

export const updateQuestion = (id: number, question: QuestionProps) => {
    return fetch(`${import.meta.env.VITE_API_URL}/sensibilisation/update?id=${id}`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(question),
    });
}

export const getQuestionById = (id: number) => {
    return fetch(`${import.meta.env.VITE_API_URL}/sensibilisation/data?id=${id}`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
    })
}

export interface QuestionProps {
    language: string;
    description: string;
    responses: string[];
    correct_response: number;
}

export interface QuestionResponse {
    question_id : number;
    correct_response: number;
    contents: Record<string, QuestionContent>;
}

export interface QuestionContent {
    description: string;
    responses: string[];
}



import { ACTOR_VALUES } from "@app/js/constants/card";
import { Actor, Bad_Practice_Card, BaseCard, Best_Practice_Card, Card, EmptyCard, Expert_Card, Formation_Card } from "@shared/common/Cards";
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
  
type MultipleContentsCard = (
    | TransformCard<Expert_Card>
    | TransformCard<Best_Practice_Card>
    | TransformCard<Bad_Practice_Card>
    | TransformCard<Formation_Card>
    | TransformCard<EmptyCard>
  );
  
type TransformCard<T extends BaseCard> = Omit<T, "actor" | "title" | "contents"> & {
    languageContents: {
      language: Language;
      actorName: string;
      actorType: Actor;
      title: string;
      description: string;
    }[];
};
  
export {
    addCard
};



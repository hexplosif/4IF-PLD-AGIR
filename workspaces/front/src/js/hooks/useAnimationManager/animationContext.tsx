import { createContext, RefObject, useRef } from "react";
import { AnimationType } from "./constants";
import anime from "animejs";

type AnimationState = {
    putIfExists: (animationType: AnimationType, anime: anime.AnimeInstance) => void,
    getAnimeAvailable: () => Map<AnimationType, anime.AnimeInstance>,
}

export const AnimationContext = createContext< AnimationState | null>(null);
export const AnimationProvider = ({children}) => {
    const animeInstances = useRef(new Map<AnimationType, anime.AnimeInstance>());

    const putIfExists = (animationType: AnimationType, anime: anime.AnimeInstance) => {
        animeInstances.current.set(animationType, anime);
    }
    const getAnimeAvailable = () => animeInstances.current;

    return (
        <AnimationContext.Provider value={{ putIfExists, getAnimeAvailable }}>
            {children}
        </AnimationContext.Provider>
    );
}
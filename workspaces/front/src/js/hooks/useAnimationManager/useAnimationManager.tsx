import { useContext } from "react";
import { AnimationContext } from "./animationContext";
import { AnimationType } from "./constants";

export type AnimationManager = {
    putIfExists: (animationType: AnimationType, anime: anime.AnimeInstance) => void,
    play: (animation: AnimationType) => Promise<void>,
    resetToStart: (animation: AnimationType) => void,
};

const useAnimationManager = () : AnimationManager => {
    const animationContext = useContext(AnimationContext);
    if (!animationContext) {
        throw new Error("useAnimationManager must be used within a AnimationProvider");
    }

    const { getAnimeAvailable, putIfExists } = animationContext;

    const play = (animation: AnimationType) => {
        const animeInstance = getAnimeAvailable().get(animation);
        if (!animeInstance) {
            console.error(`Animation ${animation} not found`);
            return;
        }
        animeInstance.restart();
        animeInstance.play();
        return animeInstance.finished;
    }

    const resetToStart = (animation: AnimationType) => {
        const animeInstance = getAnimeAvailable().get(animation);
        if (!animeInstance) {
            console.error(`Animation ${animation} not found`);
            return;
        }
        animeInstance.pause();
        animeInstance.seek(0);
    }

    return {
        putIfExists,
        play,
        resetToStart,
    }
}

export default useAnimationManager;
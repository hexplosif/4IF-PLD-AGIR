import { useMemo } from 'react';
import { DrawMode } from '@shared/server/types';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useRecoilState } from 'recoil';
import { AskDrawModeState } from "@app/js/states/gameStates";
import Quiz from '@app/components/question/quiz';

const QuestionnairePick = () => {
    const { sm } = useSocketManager();
    const [askDrawMode, setAskDrawMode] = useRecoilState(AskDrawModeState);
    const drawModeList = useMemo(() => [
        DrawMode.Random,
        DrawMode.RandomFormation,
        DrawMode.GoodFormation,
        DrawMode.Expert,
    ], []);

    const handleAnswer = (index: number | null) => {
        const drawMode = drawModeList[index === null ? 0 : index];
        sm.emit({
            event: ClientEvents.DrawModeChoice,
            data: { drawMode: drawMode }
        });
        setAskDrawMode(null);
    }

    const getOptions = () => {
        const options = [];
        options.push({label: 'Random', disabled: false});
        options.push({label: 'Random formation', disabled:!askDrawMode.formationCardLeft});
        options.push({label: 'Good formation', disabled:!askDrawMode.formationSameTypeCardLeft});
        options.push({label: 'Expert', disabled:!askDrawMode.expertCardLeft});
        return options;
    }

    return (
        <Quiz
            questionTitle='Questionnaire de pioche'
            questionText='Veuillez-vous choisir un mode de pioche:'
            options={getOptions()}
            onAnswer={handleAnswer}
            timeToAnswer={15}
        />
    );
};

export default QuestionnairePick;

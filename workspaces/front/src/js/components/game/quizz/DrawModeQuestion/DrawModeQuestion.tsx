import { useMemo } from 'react';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useRecoilState } from 'recoil';
import { AskDrawModeState } from "@app/js/states/gameStates";
import { DrawMode, pointCost } from '@shared/common/Game';
import { GameModeQuiz } from "@app/components/question";

interface DrawModeQuestionProps {
    playerSensibilisationPoints: number;
}

const QuestionnairePick = ({playerSensibilisationPoints}) => {
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
        console.log(playerSensibilisationPoints);
        const options = [];
        options.push({label: 'Random (free)', disabled: false});
        options.push({
            label: `Random formation (${pointCost[DrawMode.RandomFormation]} sensibilisation pts)`, 
            disabled:!askDrawMode.formationCardLeft || playerSensibilisationPoints < pointCost[DrawMode.RandomFormation]
        });
        options.push({
            label: `Good formation (${pointCost[DrawMode.GoodFormation]} sensibilisation pts)`,
            disabled:!askDrawMode.formationSameTypeCardLeft || playerSensibilisationPoints < pointCost[DrawMode.GoodFormation],
        });
        options.push({
            label: `Expert (${pointCost[DrawMode.Expert]} sensibilisation pts)`,
            disabled:!askDrawMode.expertCardLeft || playerSensibilisationPoints < pointCost[DrawMode.Expert],
        });
        console.log(options);
        return options;
    }

    return (
        <GameModeQuiz
            questionTitle='Questionnaire de pioche'
            questionText='Veuillez-vous choisir un mode de pioche:'
            options={getOptions()}
            onAnswer={handleAnswer}
            timeToAnswer={15}
        />
    );
};

export default QuestionnairePick;

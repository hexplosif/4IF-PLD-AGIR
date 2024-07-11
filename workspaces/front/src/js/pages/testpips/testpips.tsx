import React from 'react';
import Header from "@app/js/components/header/Header";
import SensibilisationQuizz from "@app/js/components/SensibilisationQuizz/SensibilisationQuizz";
import GameManager from '@app/js/components/Game/GameManager';
import QuestionnairePick from '@app/js/components/QuestionnairePick/QuestionnairePick';
function PageTest(){
    return (
        <div>
            <Header />
            <QuestionnairePick/>
        </div>
    )
}

export default PageTest;
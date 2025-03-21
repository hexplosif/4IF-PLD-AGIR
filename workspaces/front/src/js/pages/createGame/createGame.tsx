import Header from "@app/js/components/header/Header";
import CreateGame from '@app/js/components/CreateGame/CreateGame';
import { useGameManager } from "@app/js/hooks";
function PageCreateGame(){
    useGameManager();

    return (<>
        <Header />
        <CreateGame />
    </>)
}

export default PageCreateGame;
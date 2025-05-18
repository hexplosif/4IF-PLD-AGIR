import { Modal, Table } from "@mantine/core";

import styles from './GameHistoryPopup.module.css';
import { useEffect, useState } from "react";
import { PlayerGameHistoryInterface } from "@shared/common/Game.ts";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface GameHistoryPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

function GameHistoryPopup(props: GameHistoryPopupProps) {
    const { t } = useTranslation('gameHistory');

    const { open, setOpen } = props;

    const [ gamesJoined, setGamesJoined ] = useState<PlayerGameHistoryInterface[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") {
            console.error("No token found in local storage");
            return;
        }

        const fetchData = async () => {
            try {
                const gamesJoinedResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/users/gamesJoined?token=${token}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const gamesJoinedData = await gamesJoinedResponse.json();

                console.log(gamesJoinedData.games);
                setGamesJoined(gamesJoinedData.games);
            } catch (error) {
                console.error(error);
            }
        };

        if (open) {
            fetchData();
        } else {
            setGamesJoined([]);
        }
    }, [open]);

    return (
        <Modal opened={open}
               onClose={() => setOpen(false)}
               title={t('title')}
               centered
               padding="30"
               overlayProps={{ opacity: 0.8, blur: 3 }}
               zIndex={1000}
               classNames={{
                   content: styles.container,
                   title: styles.title,
               }}
               size="55rem"
        >
            <Table className={styles.table}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th></Table.Th>
                        <Table.Th>{t('table-headers.created-at')}</Table.Th>
                        <Table.Th>{t('table-headers.updated-at')}</Table.Th>
                        <Table.Th>{t('table-headers.finished-at')}</Table.Th>
                        <Table.Th>{t('table-headers.round')}</Table.Th>
                        <Table.Th>{t('table-headers.status')}</Table.Th>
                        <Table.Th>{t('table-headers.carbon-loss')}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {gamesJoined.map((game: PlayerGameHistoryInterface, index) => {
                        return (
                        <Table.Tr key={index}>
                            <Table.Td>{index+1}</Table.Td>
                            <Table.Td>{format(game.created_at, "dd/MM/yyyy")}</Table.Td>
                            <Table.Td>{format(game.updated_at, "dd/MM/yyyy")}</Table.Td>
                            <Table.Td>{game.finished_at !== null ? format(game.finished_at, "dd/MM/yyyy") : ""}</Table.Td>
                            <Table.Td>{game.round}</Table.Td>
                            <Table.Td>{game.status}</Table.Td>
                            <Table.Td>{game.carbon_loss}</Table.Td>
                        </Table.Tr>
                        )
                    }
                    )}
                </Table.Tbody>
            </Table>
        </Modal>
    );
}

export default GameHistoryPopup;
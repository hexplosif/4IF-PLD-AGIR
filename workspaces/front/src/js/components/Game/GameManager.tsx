import useSocketManager from "@hooks/useSocketManager";
import { useEffect } from "react";
import { Listener } from "@components/websocket/types";
import { useRecoilState } from "recoil";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  CurrentLobbyState,
  CurrentGameState,
  CurrentSensibilisationQuestion,
  CurrentPracticeQuestion,
  CurrentUseSensibilisationPoints,
  CurrentGameReport,
} from "./states";
import { ServerEvents } from "@shared/server/ServerEvents";
import { ServerPayloads } from "@shared/server/ServerPayloads";
import LobbyComponent from "../LobbyComponent/LobbyComponent";
import { ClientEvents } from "@shared/client/ClientEvents";
import { notifications } from "@mantine/notifications";
import { Bad_Practice_Card } from "@shared/common/Cards";

export default function GameManager() {
  const { sm, socket } = useSocketManager();
  const naviguate = useNavigate();
  const location = useLocation();
  const isLobbyPath = location.pathname.includes("/lobby");

  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);
  const [gameState, setGameState] = useRecoilState(CurrentGameState);
  const [sensibilisationQuestion, setSensibilisationQuestion] = useRecoilState(
    CurrentSensibilisationQuestion
  );
  const [practiceQuestion, setPracticeQuestion] = useRecoilState(
    CurrentPracticeQuestion
  );
  const [gameReport, setGameReport] = useRecoilState(CurrentGameReport);
  const [useSensibilisationPoints, setUseSensibilisationPoints] =
    useRecoilState(CurrentUseSensibilisationPoints);

  useEffect(() => {
    const onLobbyState: Listener<
      ServerPayloads[ServerEvents.LobbyState]
    > = async (data) => {
      console.log("[GameManager] Setting up event listener");
      if (!location.pathname.includes("/game")) {
        setLobbyState(data);
        localStorage.setItem("ownerId", data.ownerId);
        if (!location.pathname.includes("/lobby")) {
          naviguate(`/lobby/${data.lobbyId}`);
        }
      }
    };

    const onGameState: Listener<ServerPayloads[ServerEvents.GameState]> = (
      data
    ) => {
      setGameState(data);
    };

    const onLobbyJoined: Listener<ServerPayloads[ServerEvents.LobbyJoined]> = (
      data
    ) => {
      console.log("[GameManager] Lobby clientInGameId:", data.clientInGameId);
      localStorage.setItem("clientInGameId", data.clientInGameId);
      console.log(
        "[GameManager] Lobby clientInGameId after set:",
        data.clientInGameId
      );
    };

    const onGameStart: Listener<ServerPayloads[ServerEvents.GameStart]> = (
      data
    ) => {
      console.log("[GameManager] Game start data:", data);
      setGameState(data.gameState);
      setSensibilisationQuestion(data.sensibilisationQuestion);
      naviguate("/game/");
    };

    const onCardPlayed: Listener<ServerPayloads[ServerEvents.CardPlayed]> = (
      data
    ) => {
      let message = "";
      if (data.discarded) {
        message = `${data.playerName} discarded a ${data.card.cardType} card`;
      } else {
        switch (data.card.cardType) {
          case "BadPractice":
            message = `${data.playerName} played a Bad Practice card to ${gameState?.playerStates.find((p) => p.clientInGameId === (data.card as Bad_Practice_Card).targetedPlayerId)?.playerName}`;
            break;
          case "BestPractice":
            message = `${data.playerName} played a Best Practice card`;
            break;
          case "Expert":
            message = `${data.playerName} played an Expert card and is now immuned to ${data.card.actor} bad pratices`;
            break;
          case "Formation":
            message = `${data.playerName} played a Formation card and has cured the ${data.card.actor} bad pratice`;
            break;
        }
      }

      notifications.show({
        title: "Card played",
        message,
      });
      if (
        data.card.cardType === "BadPractice" ||
        data.card.cardType === "BestPractice"
      ) {
        setPracticeQuestion(data);
      }
    };

    const onGetSensibilisationQuestion: Listener<
      ServerPayloads[ServerEvents.SensibilisationQuestion]
    > = (data) => {
      setSensibilisationQuestion(data);
    };

    const onSensibilisationAnswered: Listener<
      ServerPayloads[ServerEvents.SensibilisationAnswered]
    > = () => {
      setSensibilisationQuestion(null);
    };

    const onPlayerPast: Listener<ServerPayloads[ServerEvents.PlayerPassed]> = (
      data
    ) => {
      notifications.show({
        title: "Player passed turn",
        message: `${data.playerName} passed his turn because he has not yet answered correctly to the sensibilisation question`,
        color: "orange",
      });
    };

    const onPracticeAnswered: Listener<
      ServerPayloads[ServerEvents.PracticeAnswered]
    > = () => {
      setPracticeQuestion(null);
    };

    const onGameReport: Listener<ServerPayloads[ServerEvents.GameReport]> = (
      data
    ) => {
      setGameReport(data);
      naviguate("/game/report/");
    };

    const onUseSensibilisationPoints: Listener<
      ServerPayloads[ServerEvents.UseSensibilisationPoints]
    > = (data) => {
      setUseSensibilisationPoints(data);
    };

    if (!socket.connected) {
      sm.connect();
    }
    if (!sm.socket.hasListeners(ServerEvents.LobbyState))
      sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    if (!sm.socket.hasListeners(ServerEvents.LobbyJoined))
      sm.registerListener(ServerEvents.LobbyJoined, onLobbyJoined);
    if (!sm.socket.hasListeners(ServerEvents.GameState))
      console.log("[GameManager] Registering listener GameState");
    sm.registerListener(ServerEvents.GameState, onGameState);
    if (!sm.socket.hasListeners(ServerEvents.GameStart))
      console.log("[GameManager] Registering listener GameStart");
    sm.registerListener(ServerEvents.GameStart, onGameStart);
    if (!sm.socket.hasListeners(ServerEvents.CardPlayed))
      sm.registerListener(ServerEvents.CardPlayed, onCardPlayed);
    if (!sm.socket.hasListeners(ServerEvents.PracticeAnswered))
      sm.registerListener(ServerEvents.PracticeAnswered, onPracticeAnswered);
    if (!sm.socket.hasListeners(ServerEvents.SensibilisationQuestion))
      sm.registerListener(
        ServerEvents.SensibilisationQuestion,
        onGetSensibilisationQuestion
      );
    if (!sm.socket.hasListeners(ServerEvents.SensibilisationAnswered))
      sm.registerListener(
        ServerEvents.SensibilisationAnswered,
        onSensibilisationAnswered
      );
    if (!sm.socket.hasListeners(ServerEvents.PlayerPassed))
      sm.registerListener(ServerEvents.PlayerPassed, onPlayerPast);
    if (!sm.socket.hasListeners(ServerEvents.GameReport))
      sm.registerListener(ServerEvents.GameReport, onGameReport);
    if (!sm.socket.hasListeners(ServerEvents.UseSensibilisationPoints))
      sm.registerListener(
        ServerEvents.UseSensibilisationPoints,
        onUseSensibilisationPoints
      );

    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.LobbyJoined, onLobbyJoined);
      sm.removeListener(ServerEvents.GameState, onGameState);
      sm.removeListener(ServerEvents.GameStart, onGameStart);
      sm.removeListener(ServerEvents.CardPlayed, onCardPlayed);
      sm.removeListener(
        ServerEvents.SensibilisationQuestion,
        onGetSensibilisationQuestion
      );
      sm.removeListener(
        ServerEvents.SensibilisationAnswered,
        onSensibilisationAnswered
      );
      sm.removeListener(ServerEvents.PlayerPassed, onPlayerPast);
      sm.removeListener(ServerEvents.PracticeAnswered, onPracticeAnswered);
      sm.removeListener(ServerEvents.GameReport, onGameReport);
      sm.removeListener(
        ServerEvents.UseSensibilisationPoints,
        onUseSensibilisationPoints
      );
    };
  }, []);

  if (!lobbyState) {
    return <></>;
  }
  if (!gameState && isLobbyPath) {
    return <LobbyComponent />;
  }

  return <div></div>;
}

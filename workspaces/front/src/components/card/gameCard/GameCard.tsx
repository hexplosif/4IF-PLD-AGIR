import { Actor, Card } from "@shared/common/Cards";
import React from "react";
import { ReactSVG } from 'react-svg'
import BaseCard from "../baseCard/BaseCard";

import GoodPracticeIcon from "@app/assets/icons/svg/icon_goodpractice.svg";

import DevelopperIcon from "@app/assets/icons/svg/icon_developer.svg";
import ProductOwnerIcon from "@app/assets/icons/svg/icon_product_owner.svg";
import ArchitectIcon from "@app/assets/icons/svg/icon_lead_tech.svg";

import { LuDatabaseZap } from "react-icons/lu";
import { BsCpu } from "react-icons/bs";
import { RiRouterLine } from "react-icons/ri";
import { PiFloppyDisk } from "react-icons/pi";
import { CARD_ACTOR_COLORS, CARD_EXPERT_HEADER_SUBTITLE, CARD_EXPERT_HEADER_TITLE, CARD_FORMATION_HEADER_TITLE, CARD_TYPE_COLORS } from "../constants";

interface GameCardProps {
    width?: number | '100%';
    card: Card;
    className?: string;
}

const GameCard : React.FC<GameCardProps> = ({
    width = '100%',
    card,
    className = "",
}) => {

    const getIconFromGainType = (gainType: string) => {
        switch (gainType) {
            case "network":
                return <RiRouterLine/>;
            case "cpu":
                return <BsCpu/>;
            case "storage":
                return <PiFloppyDisk/>;
            case "memory":
                return <LuDatabaseZap/>;
            default:
                return null;
        }
    }


    const getIconFromActor = (actor: Actor) => {
        switch (actor) {
            case Actor.DEVELOPER:
                return <ReactSVG src={DevelopperIcon} wrapper="span"/>;
            case Actor.PRODUCT_OWNER:
                return <ReactSVG src={ProductOwnerIcon} wrapper="span"/>;
            case Actor.ARCHITECT:
                return <ReactSVG src={ArchitectIcon} wrapper="span"/>;
            default:
                return null;
        }
    }


    const getHeader = () => {
        let title = "";
        let subtitle = undefined;
        switch (card.cardType) {
            case "BestPractice":
                title = card.carbon_loss + "kg";
                // subtitle = "CO2 économisés";
                break;
            case "BadPractice":
                title = "Mauvaise pratique";
                break;
            case "Formation":
                // title = CARD_FORMATION_HEADER_TITLE[card.actor];
                title = "Formation";
                break;
            case "Expert":
                // title = CARD_EXPERT_HEADER_TITLE[card.actor];
                title = "Expert";
                subtitle = CARD_EXPERT_HEADER_SUBTITLE[card.actor];
                break;
        }

        return ({
            color: CARD_TYPE_COLORS[card.cardType],
            icon: card.cardType === "BestPractice" ? <ReactSVG src={GoodPracticeIcon} wrapper="span"/> : getIconFromActor(card.actor),
            title, subtitle
        })
    }


    const getFooter = () => {
        if (card.cardType === "Expert" || card.cardType === "Formation") { return undefined; }
        
        const gainsIcons = [];
        if ('network_gain' in card && card.network_gain) { gainsIcons.push(getIconFromGainType("network")); }
        if ('cpu_gain' in card && card.cpu_gain) { gainsIcons.push(getIconFromGainType("cpu")); }
        if ('storage_gain' in card && card.storage_gain) { gainsIcons.push(getIconFromGainType("storage")); }
        if ('memory_gain' in card && card.memory_gain) { gainsIcons.push(getIconFromGainType("memory")); }

        return ({
            actor: {
                color: CARD_ACTOR_COLORS[card.actor],
                icon: getIconFromActor(card.actor),
                label: "Acteur",
            },
            gainsTypes: {
                color: "#ffffffb0",
                icons: gainsIcons,
                label: "Gains"
            },
            difficulty: {
                color: "#F8E0A3",
                icon: ('difficulty' in card && card.difficulty) ? card.difficulty : 0,
                label: "Difficulté"
            }
        })
    }


    return (
        <BaseCard
            width={width}
            header={getHeader()}
            body={{
                title: card.title,
                content: card.contents,
            }}
            footer={getFooter()}
            className={className}
        />
    );
}

export default GameCard;


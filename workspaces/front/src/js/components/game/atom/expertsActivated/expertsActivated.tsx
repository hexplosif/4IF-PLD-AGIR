import { Actor } from "@shared/common/Cards";
import { ReactSVG } from "react-svg";
import styles from "./expertsActivated.module.css";

import DevelopperIcon from "@app/assets/icons/svg/icon_developer.svg";
import ProductOwnerIcon from "@app/assets/icons/svg/icon_product_owner.svg";
import ArchitectIcon from "@app/assets/icons/svg/icon_lead_tech.svg";
import { CARD_ACTOR_COLORS } from "@app/components/card/constants";

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

interface ExpertsActivatedType {
    [Actor.ARCHITECT]: boolean;
    [Actor.DEVELOPER]: boolean;
    [Actor.PRODUCT_OWNER]: boolean;
}

interface ExpertsActivatedProps {
    expertsActivated: ExpertsActivatedType;
    sizeIcon?: number;
    backgroundColor?: string;
}

const ExpertsActivated: React.FC<ExpertsActivatedProps> = ({
    expertsActivated,
    sizeIcon = 20,
    backgroundColor = 'transparent',
}) => {
    const renderExperts = () => {
		const expertArrays = [Actor.ARCHITECT, Actor.DEVELOPER, Actor.PRODUCT_OWNER] as const;
		
		return (
			<div className={styles.immuneTypeContainer}>
				{expertArrays.map((actor) => (
				<div 
					key={actor}
					className={`${styles.immuneType} ${expertsActivated[actor] ? styles.activeImmune : ''}`}
					style={ expertsActivated[actor] ? {
						background: CARD_ACTOR_COLORS[actor],
                        width: sizeIcon,
                        height: sizeIcon,
					} : {
                        width: sizeIcon,
                        height: sizeIcon,
                    }}
				>
					{expertsActivated[actor] ? getIconFromActor(actor) : ''}
					{expertsActivated[actor] && <div className={styles.immuneGlow} />}
				</div>
				))}
			</div>
		);
  	};

    return (
        <div className={styles.immuneDisplay} style={{ backgroundColor }}>
            {renderExperts()}
        </div>
    )
}

export default ExpertsActivated;
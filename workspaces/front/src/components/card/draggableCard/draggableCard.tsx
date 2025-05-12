import { ItemTypes } from "@app/js/types/DnD";
import { Card } from "@shared/common/Cards";
import { useRef } from "react";
import { useDrag } from "react-dnd";
import GameCard from "../gameCard/GameCard";

interface DraggableCardProps {
    width?: number | '100%';
    card: Card;
    className?: string;
    canPlay?: boolean;
    canDrag?: boolean;
    cause?: string; // reason why player can not play this card
    style: React.CSSProperties;
}

const DraggableCard : React.FC<DraggableCardProps> = ({
    width = '100%',
    card,
    className = "",
    canPlay = true,
    canDrag = true,
    cause = "",
    style = {},
}) => {
    const ref = useRef<HTMLDivElement>(null)

    const [{isDragging}, dragRef] = useDrag({
        type: ItemTypes.CARD,
        item: { card, canPlay, canDrag, cause },
        canDrag: () => canDrag,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }, [card]);
    dragRef(ref);

    const draggingStyle: React.CSSProperties = {
        opacity: isDragging ? 0.4 : 1,
        pointerEvents: isDragging ? 'none' : 'auto',
    };

    const cannotPlayOverlayStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#00000025',
      zIndex: 10,
      borderRadius: '8px',
    }

    return (
        <div
          ref={ref}
          style={{ ...style, ...draggingStyle }}
          className={className}
        >
          <GameCard card={card} width={width} />
          {!canDrag && <div style={cannotPlayOverlayStyle} />}
        </div>
      );
}

export default DraggableCard;
import { useEffect, useState } from "react";
import { BUSTING_THRESHOLD } from "../constants/variables";
import { getCardsCount } from "../utils/get-cards-count";
import type { GameState } from "../types/game-state";

export interface PlayerHandProps {
  cards: string[];
  totalHouseCount: number;
  isActive: boolean;
  gameEnded: boolean;
  showActiveIndicator: boolean;
}

export const PlayerHand = ({
  cards,
  totalHouseCount,
  isActive,
  gameEnded,
  showActiveIndicator,
}: PlayerHandProps) => {
  const totalPlayerCount = getCardsCount(cards);
  const isPlayerBusted = totalPlayerCount > BUSTING_THRESHOLD;

  const isHouseBusted = totalHouseCount > BUSTING_THRESHOLD;

  const [handState, setHandState] = useState<GameState>();

  useEffect(() => {
    switch (true) {
      case isPlayerBusted:
        setHandState("Busted");
        break;
      case !gameEnded:
        setHandState(undefined);
        break;
      case isHouseBusted:
        setHandState("Won");
        break;
      case totalPlayerCount === totalHouseCount:
        setHandState("Pushed");
        break;
      default:
        setHandState(totalPlayerCount > totalHouseCount ? "Won" : "Lost");
    }
  }, [
    isPlayerBusted,
    gameEnded,
    isHouseBusted,
    setHandState,
    totalPlayerCount,
    totalHouseCount,
  ]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 m-0">
      <div className="flex flex-row gap-8 w-full">
        {showActiveIndicator && isActive && <p>{"=>"}</p>}
        <p>
          {cards.map((card, index) => {
            const isLast = index === cards.length - 1;
            if (!isLast) {
              return card + ", ";
            }
            return card;
          })}
          {!!totalPlayerCount && ` (${totalPlayerCount})`}
        </p>
        {!!handState && <p>{handState}</p>}
      </div>
    </div>
  );
};

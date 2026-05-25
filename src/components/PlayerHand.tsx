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
  betValues: number[];
}

export const PlayerHand = ({
  cards,
  totalHouseCount,
  isActive,
  gameEnded,
  showActiveIndicator,
  betValues,
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
      <div className="flex flex-row gap-8 w-full justify-center">
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
      </div>
      <div className="flex flex-col gap-10 justify-center items-center">
        {!!betValues.length && (
          <>
            <p>Bet Total: {betValues.reduce((acc, cur) => acc + cur, 0)}</p>
            <button className="rounded-[50%] border border-black p-2 w-25 h-25 shadow-[2px_2px_0px_0px_rgba(0,0,0,1),4px_4px_0px_0px_rgba(0,0,0,0.8)]">
              {betValues[betValues.length - 1]}
            </button>
          </>
        )}
        {!!handState && <p>{handState}</p>}
      </div>
    </div>
  );
};

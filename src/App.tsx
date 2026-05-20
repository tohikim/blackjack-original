import { useEffect, useRef, useState, type MouseEvent } from "react";
import { getDeck } from "./utils/get-deck";
import { shuffle } from "./utils/shuffle-deck";
import { getCardsCount } from "./utils/get-cards-count";
import {
  BUSTING_THRESHOLD,
  figureValues,
  HOUSE_DRAWING_THRESHOLD,
  SHOE_SHUFFLING_THRESHOLD,
} from "./constants/cards";
import { sleep } from "./utils/sleep";
import { cloneDeep } from "lodash";
import type { Figures } from "./types/figures";
import { PlayerHand } from "./components/PlayerHand";

function App() {
  const [deck, setDeck] = useState<string[]>([]);
  const deckRef = useRef(deck);
  const [houseCards, setHouseCards] = useState<string[]>([]);
  const [playerCards, setPlayerCards] = useState<string[][]>([[]]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [playerTurnEnded, setPlayerTurnEnded] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const [handEnded, setHandEnded] = useState(false);

  const totalHouseCount = getCardsCount(houseCards);
  const isHouseBusted = totalHouseCount > BUSTING_THRESHOLD;
  const houseTurnEnded = totalHouseCount >= HOUSE_DRAWING_THRESHOLD;

  const handleStartGame = (e: MouseEvent) => {
    e.preventDefault();
    const firstCard = deck[0];
    const secondCard = deck[1];
    const thirdCard = deck[2];

    setPlayerCards([[firstCard, thirdCard]]);
    setHouseCards([secondCard]);

    setDeck((prev) => {
      const newDeck = prev.slice(3);

      return newDeck;
    });
  };

  const handleHitAction = (e: MouseEvent) => {
    e.preventDefault();
    const topCard = deck[0];

    setPlayerCards((prev) => {
      const targetHand = [...prev[activeHandIndex], topCard];

      const prefixState = prev.slice(0, activeHandIndex);
      const suffixState = prev.slice(activeHandIndex + 1, prev.length);

      return [...prefixState, targetHand, ...suffixState];
    });

    setDeck((prev) => {
      const newDeck = prev.slice(1);

      return newDeck;
    });
  };

  const handleStandAction = async (e: MouseEvent) => {
    e.preventDefault();

    setActiveHandIndex((prev) => prev - 1);
  };

  const handleSplitAction = (e: MouseEvent) => {
    e.preventDefault();

    setActiveHandIndex((prev) => prev + 1);

    // deal 1 card to the index to the right (do not relay on state here as it's not yet updated.)
  };

  const handleReplay = (e: MouseEvent) => {
    e.preventDefault();

    setHouseCards([]);
    setPlayerCards([]);
    setActiveHandIndex(0);
    setPlayerTurnEnded(false);
    setHandEnded(false);

    handleStartGame(e);
  };

  useEffect(() => {
    const orderedDeck = getDeck();
    setDeck(shuffle(orderedDeck));
  }, []);

  useEffect(() => {
    const orderedDeck = getDeck();
    if (
      deck.length < SHOE_SHUFFLING_THRESHOLD &&
      activeHandIndex >= 0 &&
      houseTurnEnded
    ) {
      setDeck(shuffle(orderedDeck));
    }
  }, [deck]);

  useEffect(() => {
    if (playerTurnEnded || !playerCards.length) {
      setCanSplit(false);

      return;
    }

    const firstCardValue =
      figureValues[playerCards?.[activeHandIndex]?.[0]?.[0] as Figures];
    const secondCardValue =
      figureValues[playerCards?.[activeHandIndex]?.[1]?.[0] as Figures];

    setCanSplit(
      firstCardValue !== undefined &&
        firstCardValue === secondCardValue &&
        playerCards[activeHandIndex].length === 2,
    );
  }, [playerCards, activeHandIndex]);

  useEffect(() => {
    const allPlayerHandsAreBusted = playerCards.every(
      (playerHand) => getCardsCount(playerHand) > BUSTING_THRESHOLD,
    );

    if (!!playerCards.length && allPlayerHandsAreBusted) {
      setHandEnded(true);

      return;
    }
    const activeHand = playerCards[activeHandIndex];

    if (
      activeHandIndex >= 0 &&
      activeHandIndex < playerCards.length &&
      activeHand &&
      getCardsCount(activeHand) > BUSTING_THRESHOLD
    ) {
      setActiveHandIndex((prev) => prev - 1);
    }
  }, [playerCards, activeHandIndex]);

  useEffect(() => {
    if (activeHandIndex >= 0) {
      return;
    }

    (async () => {
      const newDeck = cloneDeep(deckRef.current);
      let internalHouseCount = getCardsCount(houseCards);

      do {
        const topCard = newDeck[0];

        internalHouseCount += figureValues[topCard[0] as Figures];

        setHouseCards((prev) => [...prev, topCard]);

        newDeck.shift();

        await sleep(1000);
      } while (internalHouseCount < HOUSE_DRAWING_THRESHOLD);

      setHandEnded(true);
      setDeck(newDeck);
    })();
  }, [activeHandIndex]);

  return (
    <div className="flex flex-col items-center justify-center text-4xl gap-10 p-10">
      {!houseCards.length ? (
        <button
          onClick={handleStartGame}
          className="border border-black rounded-2xl p-2"
        >
          Start the game
        </button>
      ) : (
        <div className="flex flex-col items-center justify-center text-4xl gap-10 p-10">
          <p>
            House cards:{" "}
            {houseCards.map((card, index) => {
              const isLast = index === houseCards.length - 1;
              if (!isLast) {
                return card + ", ";
              }
              return card;
            })}
            (Total count: {totalHouseCount})
          </p>
          {isHouseBusted && <p>HOUSE IS BUSTED!</p>}
          <p className="m-0">Player cards: </p>
          {playerCards.map((cards, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-4xl gap-10"
              >
                <PlayerHand
                  key={index}
                  cards={cards}
                  totalHouseCount={totalHouseCount}
                  isActive={index === activeHandIndex}
                  handEnded={handEnded}
                />
              </div>
            );
          })}
          {!playerTurnEnded && !handEnded && (
            <div className="flex flex-row gap-10">
              <button
                onClick={handleHitAction}
                className="border border-black rounded-2xl p-2"
              >
                Hit
              </button>
              {canSplit && (
                <button
                  onClick={handleSplitAction}
                  className="border border-black rounded-2xl p-2"
                >
                  Split
                </button>
              )}
              <button
                onClick={handleStandAction}
                className="border border-black rounded-2xl p-2"
              >
                Stand
              </button>
            </div>
          )}
          {handEnded && (
            <div>
              <button
                className="border border-black rounded-2xl p-2"
                onClick={handleReplay}
              >
                Play again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

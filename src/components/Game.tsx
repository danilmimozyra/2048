import useGame from "../hooks/useGame.tsx";
import useKeyboard from "../hooks/useKeyboard.tsx";
import useSwipe from "../hooks/useSwipe.tsx";
import * as React from "react";

interface Props {
    tileColors: readonly string[];
}

function Game({ tileColors }: Props) {
    const { grid, move } = useGame();
    useKeyboard(move);
    const { swipeStart, swipeEnd } = useSwipe<React.MouseEvent | React.TouchEvent>(move);

    return (
        <>
            <div
                className="board"
                onTouchStart={swipeStart}
                onTouchEnd={swipeEnd}
                onMouseDown={swipeStart}
                onMouseUp={swipeEnd}
            >
                {grid.map((tile, index) => (
                    <div
                        key={index}
                        className="tile"
                        style={{ background: tileColors[Math.min(tile, tileColors.length - 1)] }}
                    >{tile === 0 ? "" : 1 << tile}</div>
                ))}
            </div>
        </>
    )
}

export default Game;
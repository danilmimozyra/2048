import TileView from "./TileView.tsx";
import useKeyboard from "../hooks/useKeyboard.tsx";
import useSwipe from "../hooks/useSwipe.tsx";
import type {AnimPhase, Direction, GameState, Tile} from "../types.ts";

interface Props {
    gameState: GameState,
    animPhase: AnimPhase,
    move: (dir: Direction) => void,
    tileColors: readonly string[],
}

function GameBoard({ gameState, animPhase, move, tileColors }: Props) {
    const { swipeStart, swipeEnd } = useSwipe(move);
    useKeyboard(move);

    const tiles: { tile: Tile, specialClass: string }[] = [
        ...gameState.unmodified.map(t => ({ tile: t, specialClass: ""})),
        ...gameState.moved.map(t => ({ tile: t, specialClass: ""})),
    ];

    switch (animPhase) {
        case "moving":
            tiles.push(
                ...gameState.mergeMoved.map(t => ({ tile: t, specialClass: ""})),
            );
            break;

        case "spawning":
            tiles.push(
                ...gameState.merged.map(t => ({ tile: t, specialClass: "merged"})),
                ...gameState.spawned.map(t => ({ tile: t, specialClass: "spawned"})),
            );
            break;

        case "idle":
            tiles.push(
                ...gameState.merged.map(t => ({ tile: t, specialClass: ""})),
                ...gameState.spawned.map(t => ({ tile: t, specialClass: ""})),
            );
            break;
    }

    return (
        <>
            <div
                className="board"
                onTouchStart={swipeStart}
                onTouchEnd={swipeEnd}
                onMouseDown={swipeStart}
                onMouseUp={swipeEnd}
            >
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="cell" />
                ))}

                {tiles.map(t =>
                    <TileView
                        key={t.tile.id}
                        tile={t.tile}
                        specialClass={t.specialClass}
                        tileColors={tileColors}
                        posMultiplier={100}
                    />
                )}
            </div>
        </>
    )
}

export default GameBoard;
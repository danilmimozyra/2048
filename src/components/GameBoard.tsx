import { GameTile, GameGrid } from "../types.ts";
import {useState} from "react";
import {themes} from "../themes.ts";

interface Props {
    onTileMove: (movedTile: GameTile,
                 fromRow: number, fromCol: number,
                 toRow: number, toCol: number) => void;

    onTileMerge: (mergedTile: GameTile,
                 fromRow: number, fromCol: number,
                 toRow: number, toCol: number) => void;
}

function GameBoard({ onTileMove, onTileMerge }: Props) {
    const [gameGrid] = useState(() => {
        const grid = GameGrid.fromSideLength(4);
        grid.setOnMoveCallback(onTileMove);
        grid.setOnMergeCallback(onTileMerge);
        return grid;
    });

    return (
        <>
            <div className="board">
                {gameGrid.getTileArray().map((tile, index) => (
                    <div
                        key={index}
                        className="tile"
                        style={{ background: themes.light.tileColors[tile.getPower()] }}
                    >{tile.isEmpty() ? "" : tile.getValue()}</div>
                ))}
            </div>
        </>
    )
}

export default GameBoard;
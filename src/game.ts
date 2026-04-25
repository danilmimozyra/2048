import type {Direction, GameState, Tile} from "./types.ts";
import {assert, copyTile, emptyGameState, mergeGameStates, reduceGameStateToTiles} from "./util.ts";

type Axis = "row" | "col";

let maxId = 0;
const nextId = () => ++maxId;

function moveLine(line: Tile[], moveAxis: Axis, ascending: boolean): GameState {
    assert(line.length <= 4);

    const result = emptyGameState();

    let targetPos = ascending ? 0 : 3;
    const nextTargetPos = () => targetPos += ascending ? 1 : -1;

    let last = line[0]!;
    let didMerge = true;

    for (const tile of line) {
        if (!didMerge && tile.power === last.power) {
            const movedTile = copyTile(tile, { [moveAxis]: last[moveAxis] });
            const mergedTile = copyTile(last, { id: nextId(), power: tile.power + 1 });

            result.moved.splice(result.moved.indexOf(tile), 1);

            result.mergeMoved.push(movedTile, tile);
            result.merged.push(mergedTile);

            last = mergedTile;
            didMerge = true;
        }

        else if (tile[moveAxis] !== targetPos) {
            const movedTile = copyTile(tile, { [moveAxis]: targetPos });

            result.moved.push(movedTile);

            last = movedTile;
            didMerge = false;
            nextTargetPos();
        }

        else {
            result.unmodified.push(copyTile(tile));

            last = tile;
            didMerge = false;
            nextTargetPos();
        }
    }

    return result;
}

function moveTiles(tiles: Tile[], iterAxis: Axis, ascending: boolean): GameState {
    const moveAxis: Axis = iterAxis === "row" ? "col" : "row";
    const states: GameState[] = [];

    for (let iAxis = 0; iAxis < 4; iAxis++) {
        const line = tiles.filter(t => t[iterAxis] === iAxis);

        if (line.length === 0) continue;

        line.sort((a, b) => ascending ? a[moveAxis] - b[moveAxis] : b[moveAxis] - a[moveAxis]);

        states.push(moveLine(line, moveAxis, ascending));
    }

    return mergeGameStates(...states);
}

export function spawnTile(tiles: Tile[]): Tile {
    const occupied = new Set(tiles.map(t => (t.row << 2) | t.col));
    const empty: { row: number, col: number }[] = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (!occupied.has((row << 2) | col)) empty.push({ row: row, col: col });
        }
    }

    const power = Math.random() < 0.9 ? 1 : 2;
    const pos = empty[Math.floor(Math.random() * empty.length)]!;

    return {
        id: nextId(),
        power: power,
        row: pos.row,
        col: pos.col,
    };
}

export function move(gameState: GameState, dir: Direction): GameState {
    const tiles = reduceGameStateToTiles(gameState);

    maxId = Math.max(...tiles.map(t => t.id));

    let result: GameState;
    
    switch (dir) {
        case "up": result = moveTiles(tiles, "col", true); break;
        case "down": result = moveTiles(tiles, "col", false); break;
        case "left": result = moveTiles(tiles, "row", true); break;
        case "right": result = moveTiles(tiles, "row", false); break;
    }

    const newTiles = reduceGameStateToTiles(result);
    if (newTiles.length < 16) {
        result.spawned.push(spawnTile(newTiles));
    }

    return result;
}
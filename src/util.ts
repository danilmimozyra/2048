import type {GameState, Tile} from "./types.ts";

export function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

export function logTiles(tiles: Tile[]) {
    let s = "";
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tile = tiles.find(t => t.row === row && t.col === col);

            if (tile) {
                s += tile.power + " ";
            }
            else {
                s += "0 ";
            }
        }
        s += "\n";
    }
    console.log(s);
}

export function copyTile(tile: Tile, overrides?: Partial<Tile>): Tile {
    return {
        ...tile,
        ...overrides,
    };
}

export function copyTileArray(tiles: Tile[]): Tile[] {
    return tiles.map(t => copyTile(t));
}

export function copyGameState(moveResult: GameState, overrides?: Partial<GameState>): GameState {
    return {
        unmodified: copyTileArray(moveResult.unmodified),
        moved: copyTileArray(moveResult.moved),
        mergeMoved: copyTileArray(moveResult.mergeMoved),
        merged: copyTileArray(moveResult.merged),
        spawned: copyTileArray(moveResult.spawned),
        ...overrides,
    };
}

export function emptyGameState(): GameState {
    return {
        unmodified: [],
        moved: [],
        mergeMoved: [],
        merged: [],
        spawned: [],
    }
}

export function reduceGameStateToTiles(gameState: GameState): Tile[] {
    return [
        ...copyTileArray(gameState.unmodified),
        ...copyTileArray(gameState.moved),
        ...copyTileArray(gameState.merged),
        ...copyTileArray(gameState.spawned),
    ];
}

export function mergeGameStates(...gameStates: GameState[]): GameState {
    return copyGameState(gameStates.reduce(
        (a, b) => ({
            unmodified: [...a.unmodified, ...b.unmodified],
            moved: [...a.moved, ...b.moved],
            mergeMoved: [...a.mergeMoved, ...b.mergeMoved],
            merged: [...a.merged, ...b.merged],
            spawned: [...a.spawned, ...b.spawned],
        })
    ));
}
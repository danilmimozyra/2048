import type {Tile} from "./types.ts";

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
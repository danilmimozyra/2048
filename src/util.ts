import type {MoveResult, Position, Tile, TileMerge, TileMove, TileSpawn} from "./types.ts";

export function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

export function logTiles(tiles: Tile[]) {
    let s = "";
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tile = tiles.find(t => t.pos.row === row && t.pos.col === col);

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

export function copyPosition(pos: Position, overrides?: Partial<Position>): Position {
    return { ...pos, ...overrides };
}

export function copyTile(tile: Tile, overrides?: Partial<Tile>): Tile {
    return {
        ...tile,
        pos: copyPosition(tile.pos),
        ...overrides,
    };
}

export function copyTileMove(tileMove: TileMove, overrides?: Partial<TileMove>): TileMove {
    return {
        ...tileMove,
        from: copyPosition(tileMove.from),
        to: copyPosition(tileMove.to),
        ...overrides,
    };
}

export function copyTileMerge(tileMerge: TileMerge, overrides?: Partial<TileMerge>): TileMerge {
    return {
        ...tileMerge,
        fromIds: [...tileMerge.fromIds],
        at: copyPosition(tileMerge.at),
        ...overrides,
    };
}

export function copyTileSpawn(tileSpawn: TileSpawn, overrides?: Partial<TileSpawn>): TileSpawn {
    return {
        ...tileSpawn,
        at: copyPosition(tileSpawn.at),
        ...overrides,
    };
}

export function copyMoveResult(moveResult: MoveResult, overrides?: Partial<MoveResult>): MoveResult {
    return {
        tiles: moveResult.tiles.map(e => copyTile(e)),
        moves: moveResult.moves.map(e => copyTileMove(e)),
        merges: moveResult.merges.map(e => copyTileMerge(e)),
        spawn: moveResult.spawn ? copyTileSpawn(moveResult.spawn) : undefined,
        ...overrides,
    };
}
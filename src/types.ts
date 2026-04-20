export type Theme = {
    readonly background: string,
    readonly board_background: string,
    readonly board: string,
    readonly title: string,
    readonly tileColors: readonly string[],
}

export type Direction = "up" | "down" | "left" | "right";

export type AnimPhase = "idle" | "moving" | "merging" | "spawning";

////////////////////////////////////

export type Position = {
    row: number,
    col: number,
}

export type Tile = {
    id: number;
    power: number;
    pos: Position;
}

export type TileMove = {
    id: number,
    from: Position,
    to: Position,
}

export type TileMerge = {
    fromIds: [number, number],
    toId: number,
    at: Position,
}

export type TileSpawn = {
    id: number,
    at: Position,
}

export type MoveResult = {
    tiles: Tile[];
    moves: TileMove[],
    merges: TileMerge[],
    spawn?: TileSpawn,
}
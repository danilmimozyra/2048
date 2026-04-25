export type Theme = {
    readonly background: string,
    readonly board_background: string,
    readonly board: string,
    readonly title: string,
    readonly tileColors: readonly string[],
}

export type Direction = "up" | "down" | "left" | "right";

export type AnimPhase = "idle" | "moving" | "spawning";

////////////////////////////////////

export type Tile = {
    readonly id: number,
    readonly power: number,
    readonly row: number,
    readonly col: number,
}

export type GameState = {
    unmodified: Tile[];
    moved: Tile[],
    mergeMoved: Tile[],
    merged: Tile[],
    spawned: Tile[],
}
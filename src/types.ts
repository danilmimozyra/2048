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

export type TileState = "unmodified" | "moved" | "mergeMoved" | "merged" | "spawned";

export type Tile = {
    id: number,
    power: number,
    state: TileState,
    row: number,
    col: number,
}

// export type GameState = {
//     unmodified: Tile[];
//     moved: Tile[],
//     mergeMoved: Tile[],
//     merged: Tile[],
//     spawned: Tile[],
// }
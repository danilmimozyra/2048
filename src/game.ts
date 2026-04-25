import type {Direction, Tile} from "./types.ts";
import {assert, copyTile, copyTileArray} from "./util.ts";

type Axis = "row" | "col";

let maxId = 0;
const nextId = () => ++maxId;

function moveLine(tiles: Tile[], line: Tile[], moveAxis: Axis, ascending: boolean) {
    assert(line.length > 0 && line.length <= 4);

    let targetPos = ascending ? 0 : 3;
    const nextTargetPos = () => targetPos += ascending ? 1 : -1;

    let last = line[0]!;
    let didMerge = true;

    for (const tile of line) {
        if (!didMerge && tile.power === last.power) {
            tile[moveAxis] = last[moveAxis];
            tile.state = "mergeMoved";

            last.state = "mergeMoved";

            const mergedTile = copyTile(last, { id: nextId(), power: tile.power + 1, state: "merged" });
            tiles.push(mergedTile);

            last = mergedTile;
            didMerge = true;
        }

        else if (tile[moveAxis] !== targetPos) {
            tile[moveAxis] = targetPos;
            tile.state = "moved";

            last = tile;
            didMerge = false;
            nextTargetPos();
        }

        else {
            tile.state = "unmodified";

            last = tile;
            didMerge = false;
            nextTargetPos();
        }
    }
}

function moveTiles(tiles: Tile[], iterAxis: Axis, ascending: boolean) {
    const moveAxis: Axis = iterAxis === "row" ? "col" : "row";

    for (let iAxis = 0; iAxis < 4; iAxis++) {
        const line = tiles.filter(t => t[iterAxis] === iAxis);

        if (line.length === 0) continue;

        line.sort((a, b) => ascending ? a[moveAxis] - b[moveAxis] : b[moveAxis] - a[moveAxis]);

        moveLine(tiles, line, moveAxis, ascending);
    }
}

export function spawnTile(tiles: Tile[]) {
    const occupied = new Set(tiles.map(t => (t.row << 2) | t.col));
    const empty: { row: number, col: number }[] = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (!occupied.has((row << 2) | col)) empty.push({ row: row, col: col });
        }
    }

    const power = Math.random() < 0.9 ? 1 : 2;
    const pos = empty[Math.floor(Math.random() * empty.length)]!;

    tiles.push({
        id: nextId(),
        power: power,
        state: "spawned",
        row: pos.row,
        col: pos.col,
    });
}

export function move(tiles: Tile[], dir: Direction): Tile[] {
    tiles = copyTileArray(tiles).filter(t => t.state !== "mergeMoved");

    maxId = Math.max(...tiles.map(t => t.id));

    switch (dir) {
        case "up": moveTiles(tiles, "col", true); break;
        case "down": moveTiles(tiles, "col", false); break;
        case "left": moveTiles(tiles, "row", true); break;
        case "right": moveTiles(tiles, "row", false); break;
    }

    if (tiles.length < 16) {
        spawnTile(tiles);
    }

    return tiles;
}
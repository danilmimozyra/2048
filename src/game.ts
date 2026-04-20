import type {Direction, MoveResult, Position, Tile, TileMerge, TileMove, TileSpawn} from "./types.ts";
import {assert, copyPosition, copyTile, copyTileMerge, copyTileMove, copyTileSpawn} from "./util.ts";

type Axis = "row" | "col";

export class Game {
    private _currentID: number = 0;
    private get nextID() { return ++this._currentID; }

    private _tiles: Tile[] = [];
    private _moves: TileMove[] = [];
    private _merges: TileMerge[] = [];

    // will be overridden right after first move call or when creating a new game (Game.create())
    private _spawn?: TileSpawn;

    // "constructors" because React doesn't allow constructor overloading
    private constructor() {}

    public static create(): Game {
        const g = new Game();
        g.tileSpawn();
        g.tileSpawn();
        return g;
    }

    public static createEmpty(): Game {
        return new Game();
    }

    public static createFrom(tiles: Tile[]): Game {
        if (tiles.length === 0) return Game.createEmpty();

        const g = new Game();
        g._tiles = tiles.map(t => copyTile(t));
        g._currentID = Math.max(...tiles.map(t => t.id));
        return g;
    }

    ////////////////////////////////////////////////////////////////////

    public get tiles(): Tile[] {
        return this._tiles.map(t => copyTile(t));
    }

    public get moves(): TileMove[] {
        return this._moves.map(t => copyTileMove(t));
    }

    public get merges(): TileMerge[] {
        return this._merges.map(t => copyTileMerge(t));
    }

    public get spawn(): TileSpawn | undefined {
        return this._spawn ? copyTileSpawn(this._spawn) : undefined;
    }

    public get moveResult(): MoveResult {
        return {
            tiles: this.tiles,
            moves: this.moves,
            merges: this.merges,
            spawn: this.spawn,
        };
    }

    public get isWon(): boolean {
        return this._tiles.some(t => t.power >= 11);
    }

    public get isMoved(): boolean {
        return this._moves.length > 0 || this._merges.length > 0;
    }

    public get isLost(): boolean {
        return this._tiles.length === 16 && !this.isMoved && !this.isWon;
    }

    ////////////////////////////////////////////////////////////////////

    public move(dir: Direction): MoveResult {
        this._moves = [];
        this._merges = [];

        switch (dir) {
            case "up": this.moveTiles("col", true); break;
            case "down": this.moveTiles("col", false); break;
            case "left": this.moveTiles("row", true); break;
            case "right": this.moveTiles("row", false); break;
        }

        this.tileSpawn();

        return this.moveResult;
    }

    private moveTiles(iterAxis: Axis, ascending: boolean) {
        const moveAxis: Axis = iterAxis === "row" ? "col" : "row";

        for (let iAxis = 0; iAxis < 4; iAxis++) {
            const line = this._tiles.filter(t => t.pos[iterAxis] === iAxis);

            this.moveLine(line, moveAxis, ascending);
        }
    }

    private moveLine(line: Tile[], moveAxis: Axis, ascending: boolean) {
        if (line.length === 0) return;

        line.sort((a, b) => {
            const bigger = ascending ? a : b;
            const smaller = ascending ? b : a;
            return bigger.pos[moveAxis] - smaller.pos[moveAxis];
        });

        let currentPos = ascending ? 0 : 3;
        const advanceCurrentPos = () => { currentPos += ascending ? 1 : -1; };

        let previous: Tile = line[0]!;
        let didMerge = true;  // first iteration cannot merge

        for (const tile of line) {
            // tile merge
            if (!didMerge && tile.power === previous.power) {
                this.tileMove(tile, previous.pos);

                previous = this.tileMerge(tile, previous);
                didMerge = true;
            }

            // tile move
            else if (tile.pos[moveAxis] !== currentPos) {
                const override: Partial<Position> = { [moveAxis]: currentPos };

                previous = this.tileMove(tile, copyPosition(tile.pos, override));
                didMerge = false;
                advanceCurrentPos();
            }

            // tile cannot move
            else {
                previous = tile;
                didMerge = false;
                advanceCurrentPos();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////

    private tileMove(tile: Tile, to: Position): Tile {
        assert(
            (tile.pos.row === to.row && tile.pos.col !== to.col) ||
            (tile.pos.row !== to.row && tile.pos.col === to.col)
        );

        this._moves.push({
            id: tile.id,
            from: copyPosition(tile.pos),
            to: copyPosition(to),
        });

        tile.pos = copyPosition(to);

        return tile;
    }

    private tileMerge(t1: Tile, t2: Tile): Tile {
        assert(t1.id !== t2.id);
        assert(t1.power === t2.power);
        assert(t1.pos.row === t2.pos.row && t1.pos.col === t2.pos.col);

        this._tiles.splice(this._tiles.indexOf(t1), 1);
        this._tiles.splice(this._tiles.indexOf(t2), 1);

        const mergedTile: Tile = {
            id: this.nextID,
            power: t1.power + 1,
            pos: copyPosition(t1.pos),
        };

        this._tiles.push(mergedTile);

        this._merges.push({
            fromIds: [t1.id, t2.id],
            toId: mergedTile.id,
            at: copyPosition(mergedTile.pos),
        });

        return mergedTile;
    }

    private tileSpawn(): Tile | undefined {
        if (this._tiles.length === 16) {
            this._spawn = undefined;
            return undefined;
        }

        const occupied = new Set(this._tiles.map(t => (t.pos.row << 2) | t.pos.col));
        const empty: Position[] = [];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (!occupied.has((row << 2) | col)) empty.push({ row: row, col: col });
            }
        }

        const tile: Tile = {
            id: this.nextID,
            power: Math.random() < 0.9 ? 1 : 2,
            pos: empty[Math.floor(Math.random() * empty.length)]!,
        }

        this._tiles.push(tile);

        this._spawn = {
            id: tile.id,
            at: copyPosition(tile.pos),
        };

        return tile;
    }
}
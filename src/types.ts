// @ts-ignore
import {strict as assert} from "node:assert";

export class GameTile {
    private readonly power: number;

    // 0 is a special case for no value (empty tile)
    constructor(power: number = 0) {
        assert(power >= 0);
        this.power = power;
    }

    getPower(): number {
        return this.power;
    }

    getValue(): number {
        return 1 << this.power;
    }

    isEmpty(): boolean {
        return this.power === 0;
    }

    toString(): string {
        return this.isEmpty() ? "Empty" : `Value ${this.getValue().toString()}`;
    }
}

const MoveResult = {
    SUCCESS: "SUCCESS",  // tile will move to an empty tile
    MERGE: "MERGE",      // tile will move to a tile with the same value
    FAILURE: "FAILURE",  // tile would move to a tile with different value
    ILLEGAL: "ILLEGAL",  // tile would move outside the grid or it's empty
} as const;

export class GameGrid {
    private readonly sideLength: number;
    private readonly grid: GameTile[];

    private onMoveCallback: (movedTile: GameTile,
                             fromRow: number, fromCol: number,
                             toRow: number, toCol: number) => void;

    private onMergeCallback: (mergedTile: GameTile,
                              fromRow: number, fromCol: number,
                              toRow: number, toCol: number) => void;

    constructor(grid: GameTile[]) {
        let sqrt = Math.round(Math.sqrt(grid.length));
        assert(sqrt * sqrt === grid.length);

        this.sideLength = sqrt;
        this.grid = grid;
        this.onMoveCallback = () => {
        };
        this.onMergeCallback = () => {
        };
    }

    static fromTileMatrix(grid: GameTile[][]): GameGrid {
        assert(grid.every(e => e.length === grid.length));
        return new GameGrid(grid.flat());
    }

    static fromTileArray(grid: GameTile[]): GameGrid {
        return new GameGrid(grid);
    }

    static fromNumberGrid(grid: number[]): GameGrid {
        return new GameGrid(grid.map(e => new GameTile(e)));
    }

    static fromSize(size: number): GameGrid {
        return new GameGrid(new Array(size).fill(new GameTile()));
    }

    static fromSideLength(sideLength: number): GameGrid {
        return GameGrid.fromSize(sideLength * sideLength);
    }

    ///////////////////////////////

    getTileAt(row: number, col: number): GameTile {
        assert(this.isPositionValid(row, col));
        return this.grid[row + col * this.sideLength];
    }

    getSideLength(): number {
        return this.sideLength;
    }

    getSize(): number {
        return this.grid.length;
    }

    setTileAt(row: number, col: number, tile: GameTile) {
        assert(this.isPositionValid(row, col));
        this.grid[row + col * this.sideLength] = tile;
    }

    setOnMoveCallback(onMoveCallback: (movedTile: GameTile,
                                       fromRow: number, fromCol: number,
                                       toRow: number, toCol: number) => void) {
        this.onMoveCallback = onMoveCallback;
    }

    setOnMergeCallback(onMergeCallback: (mergedTile: GameTile,
                                         fromRow: number, fromCol: number,
                                         toRow: number, toCol: number) => void) {
        this.onMergeCallback = onMergeCallback;
    }

    moveUp() {
        for (let col = 0; col < this.sideLength; col++) {

            let low = 0, high = 1;

            while (high < this.sideLength && this.getTileAt(high, col).isEmpty()) high++;

            while (high < this.sideLength) {
                let moveRes = this.handleMove(high, col, low, col);

                if (moveRes !== MoveResult.SUCCESS) low++;

                while (high < this.sideLength && this.getTileAt(high, col).isEmpty()) high++;
            }
        }
    }

    moveDown() {
        for (let col = 0; col < this.sideLength; col++) {

            let low = this.sideLength, high = this.sideLength - 1;

            while (high >= 0 && this.getTileAt(high, col).isEmpty()) high--;

            while (high >= 0) {
                let moveRes = this.handleMove(high, col, low, col);

                if (moveRes !== MoveResult.SUCCESS) low--;

                while (high >= 0 && this.getTileAt(high, col).isEmpty()) high--;
            }
        }
    }

    moveLeft() {
        for (let row = 0; row < this.sideLength; row++) {

            let low = 0, high = 1;

            while (high < this.sideLength && this.getTileAt(row, high).isEmpty()) high++;

            while (high < this.sideLength) {
                let moveRes = this.handleMove(row, high, row, low);

                if (moveRes !== MoveResult.SUCCESS) low++;

                while (high < this.sideLength && this.getTileAt(row, high).isEmpty()) high++;
            }
        }
    }

    moveRight() {
        for (let row = 0; row < this.sideLength; row++) {

            let low = this.sideLength, high = this.sideLength - 1;

            while (high >= 0 && this.getTileAt(row, high).isEmpty()) high--;

            while (high >= 0) {
                let moveRes = this.handleMove(row, high, row, low);

                if (moveRes !== MoveResult.SUCCESS) low--;

                while (high >= 0 && this.getTileAt(row, high).isEmpty()) high--;
            }
        }
    }

    ////////////////////////////////////

    private isPositionValid(row: number, col: number): boolean {
        return row >= 0 && col >= 0 && row < this.sideLength && col < this.sideLength;
    }

    private getTileMoveResult(fromRow: number, fromCol: number, toRow: number, toCol: number): string {
        let tile = this.getTileAt(fromRow, fromCol);

        if (!this.isPositionValid(toRow, toCol) || tile.isEmpty()) {
            return MoveResult.ILLEGAL;
        }

        let targetTile = this.getTileAt(toRow, toCol);

        if (targetTile.isEmpty()) {
            return MoveResult.SUCCESS;
        }

        return tile.getPower() === targetTile.getPower() ? MoveResult.MERGE : MoveResult.FAILURE;
    }

    private moveTile(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        let tile = this.getTileAt(fromRow, fromCol);
        this.setTileAt(toRow, toCol, tile);
        this.setTileAt(fromRow, fromCol, new GameTile());

        this.onMoveCallback(tile, fromRow, fromCol, toRow, toCol);
    }

    private mergeTile(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        let tile = new GameTile(this.getTileAt(fromRow, fromCol).getPower() + 1);
        this.setTileAt(toRow, toCol, tile);
        this.setTileAt(fromRow, fromCol, new GameTile());

        this.onMergeCallback(tile, fromRow, fromCol, toRow, toCol);
    }

    /**
     * Merges or moves tiles based on `MoveResult` and returns it.
     */
    private handleMove(fromRow: number, fromCol: number, toRow: number, toCol: number): string {
        let moveRes = this.getTileMoveResult(fromRow, fromCol, toRow, toCol);

        if (moveRes === MoveResult.MERGE) {
            this.mergeTile(fromRow, fromCol, toRow, toCol);
        } else if (moveRes === MoveResult.SUCCESS) {
            this.moveTile(fromRow, fromCol, toRow, toCol);
        }

        return moveRes;
    }
}

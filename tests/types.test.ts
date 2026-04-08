import { describe, test, expect } from "vitest";

import { GameTile, GameGrid } from "../src/types";

function logGrid(grid: GameGrid) {
    let s = "";
    for (let row = 0; row < grid.getSideLength(); row++) {
        for (let col = 0; col < grid.getSideLength(); col++) {
            s += grid.getTileAt(row, col).getPower() + " ";
        }
        s += "\n";
    }
    console.log(s);
}

describe("GameGrid", () => {
    test("moveUp", () => {
        let grid = GameGrid.fromSideLength(4);

        grid.setTileAt(0, 0, new GameTile(1));
        grid.setTileAt(1, 0, new GameTile(1));
        grid.setTileAt(2, 0, new GameTile(1));
        grid.setTileAt(3, 0, new GameTile(1));

        grid.moveUp();

        expect(grid.getTileAt(0, 0).getPower()).toBe(2);
        expect(grid.getTileAt(1, 0).getPower()).toBe(2);
        expect(grid.getTileAt(2, 0).getPower()).toBe(0);
        expect(grid.getTileAt(3, 0).getPower()).toBe(0);
    });

    test("moveDown", () => {
        let grid = GameGrid.fromSideLength(4);

        grid.setTileAt(0, 0, new GameTile(1));
        grid.setTileAt(1, 0, new GameTile(1));
        grid.setTileAt(2, 0, new GameTile(1));
        grid.setTileAt(3, 0, new GameTile(1));

        grid.moveDown();

        expect(grid.getTileAt(0, 0).getPower()).toBe(0);
        expect(grid.getTileAt(1, 0).getPower()).toBe(0);
        expect(grid.getTileAt(2, 0).getPower()).toBe(2);
        expect(grid.getTileAt(3, 0).getPower()).toBe(2);
    });

    test("moveLeft", () => {
        let grid = GameGrid.fromSideLength(4);

        grid.setTileAt(0, 0, new GameTile(1));
        grid.setTileAt(0, 1, new GameTile(1));
        grid.setTileAt(0, 2, new GameTile(1));
        grid.setTileAt(0, 3, new GameTile(1));

        grid.moveLeft();

        expect(grid.getTileAt(0, 0).getPower()).toBe(2);
        expect(grid.getTileAt(0, 1).getPower()).toBe(2);
        expect(grid.getTileAt(0, 2).getPower()).toBe(0);
        expect(grid.getTileAt(0, 3).getPower()).toBe(0);
    });

    test("moveRight", () => {
        let grid = GameGrid.fromSideLength(4);

        grid.setTileAt(0, 0, new GameTile(1));
        grid.setTileAt(0, 1, new GameTile(1));
        grid.setTileAt(0, 2, new GameTile(1));
        grid.setTileAt(0, 3, new GameTile(1));

        grid.moveRight();

        expect(grid.getTileAt(0, 0).getPower()).toBe(0);
        expect(grid.getTileAt(0, 1).getPower()).toBe(0);
        expect(grid.getTileAt(0, 2).getPower()).toBe(2);
        expect(grid.getTileAt(0, 3).getPower()).toBe(2);
    });
});

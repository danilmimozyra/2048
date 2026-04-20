import {useState} from "react";
import type {Grid, Direction} from "../types.ts"

function getIndex(row: number, col: number): number {
    return (row << 2) + col;
}

function moveTiles(grid: Grid, fromIndex: number, toIndex: number): { advance: boolean, moved: boolean } {
    if (grid[toIndex] === 0) {
        grid[toIndex] = grid[fromIndex];
        grid[fromIndex] = 0;
        return { advance: false, moved: true };
    }

    if (grid[fromIndex] === grid[toIndex]) {
        grid[toIndex]++;
        grid[fromIndex] = 0;
        return { advance: true, moved: true };
    }

    return { advance: true, moved: false };
}

function moveUp(grid: Grid): { grid: Grid, moved: boolean } {
    const g = [...grid];
    let moved = false;

    for (let col = 0; col < 4; col++) {
        let low = 0, high = 1;

        while (high < 4) {
            while (high < 4 && g[getIndex(high, col)] === 0) high++;
            if (high >= 4) break;

            const res = moveTiles(g, getIndex(high, col), getIndex(low, col));
            if (res.advance) low++;
            if (res.moved) moved = true;
            if (low === high) high++;
        }
    }

    return { grid: g, moved };
}

function moveDown(grid: Grid): { grid: Grid, moved: boolean } {
    const g = [...grid];
    let moved = false;

    for (let col = 0; col < 4; col++) {
        let low = 3, high = 2;

        while (high >= 0) {
            while (high >= 0 && g[getIndex(high, col)] === 0) high--;
            if (high < 0) break;

            const res = moveTiles(g, getIndex(high, col), getIndex(low, col));
            if (res.advance) low--;
            if (res.moved) moved = true;
            if (low === high) high--;
        }
    }

    return { grid: g, moved };
}

function moveLeft(grid: Grid): { grid: Grid, moved: boolean } {
    const g = [...grid];
    let moved = false;

    for (let row = 0; row < 4; row++) {
        let low = 0, high = 1;

        while (high < 4) {
            while (high < 4 && g[getIndex(row, high)] === 0) high++;
            if (high >= 4) break;

            const res = moveTiles(g, getIndex(row, high), getIndex(row, low));
            if (res.advance) low++;
            if (res.moved) moved = true;
            if (low === high) high++;
        }
    }

    return { grid: g, moved };
}

function moveRight(grid: Grid): { grid: Grid, moved: boolean } {
    const g = [...grid];
    let moved = false;

    for (let row = 0; row < 4; row++) {
        let low = 3, high = 2;

        while (high >= 0) {
            while (high >= 0 && g[getIndex(row, high)] === 0) high--;
            if (high < 0) break;

            const res = moveTiles(g, getIndex(row, high), getIndex(row, low));
            if (res.advance) low--;
            if (res.moved) moved = true;
            if (low === high) high--;
        }
    }

    return { grid: g, moved };
}

function addNewRandomTile(grid: Grid): Grid {
    const emptyIndexes = grid.map((v, i) => v === 0 ? i : -1)
        .filter(v => v !== -1);

    if (emptyIndexes.length === 0) return grid;

    const index = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    const value = Math.random() < 0.9 ? 1 : 2;

    const newGrid = [...grid];
    newGrid[index] = value;

    return newGrid;
}

function useGame() {
    const [grid, setGrid] = useState<Grid>(
        addNewRandomTile(addNewRandomTile(new Array(16).fill(0)))
    );

    function move(direction: Direction) {
        setGrid(prev => {
            let res: {grid: Grid, moved: boolean };

            switch (direction) {
                case "up": res = moveUp(prev); break;
                case "down": res = moveDown(prev); break;
                case "left": res = moveLeft(prev); break;
                case "right": res = moveRight(prev); break;
            }

            return res.moved ? addNewRandomTile(res.grid) : prev;
        });
    }

    return {
        grid,
        move
    }
}

export default useGame;
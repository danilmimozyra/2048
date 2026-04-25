import {useState} from "react";
import type {AnimPhase, Direction, GameState, Tile} from "../types.ts";
import {move, spawnTile} from "../game.ts";
import {emptyGameState} from "../util.ts";

function createNewGameState(): GameState {
    const t1: Tile = spawnTile([]);
    const t2: Tile = spawnTile([t1]);

    const gameState = emptyGameState();
    gameState.unmodified = [t1, t2];
    return gameState;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function useGame(
    animPhase: AnimPhase,
    setAnimPhase: (animPhase: AnimPhase) => void,
    moveTimeMs: number,
    spawnTimeMs: number,
    initialGameState?: GameState,
    initialScore: number = 0
) {
    const [gameState, setGameState] = useState<GameState>(initialGameState || createNewGameState());
    const [score, setScore] = useState(initialScore);

    function newGame() {
        setGameState(createNewGameState());
        setScore(0);
        setAnimPhase("idle");
    }

    async function runAnimation() {
        setAnimPhase("moving");
        if (gameState.moved.length > 0 || gameState.mergeMoved.length > 0) {
            await delay(moveTimeMs);
        }

        setAnimPhase("spawning");
        if (gameState.merged.length > 0 || gameState.spawned.length > 0) {
            await delay(spawnTimeMs);
        }

        setAnimPhase("idle");
    }

    function moveWrapper(dir: Direction) {
        if (animPhase !== "idle") return;

        setAnimPhase("moving");
        setGameState(move(gameState, dir));
        runAnimation();
    }

    return {
        gameState,
        move: moveWrapper,
        score,
        newGame,
    }
}

export default useGame;
import { useState } from "react";
import type { AnimPhase, Direction, Tile } from "../types.ts";
import { move, spawnTile } from "../game.ts";

function createNewGameState(): Tile[] {
  const tiles: Tile[] = [];
  spawnTile(tiles);
  spawnTile(tiles);
  tiles.forEach(t => t.state = "moved");
  return tiles;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function useGame(
  animPhase: AnimPhase,
  setAnimPhase: (animPhase: AnimPhase) => void,
  moveTimeMs: number,
  spawnTimeMs: number,
  initialTiles?: Tile[],
  initialScore: number = 0,
) {
  const [tiles, setTiles] = useState<Tile[]>(
    initialTiles || createNewGameState(),
  );
  const [score, setScore] = useState(initialScore);

  function newGame() {
    setTiles(createNewGameState());
    setScore(0);
    setAnimPhase("idle");
  }

  function addScore(t: Tile[]) {
    const powers = t
      .filter((t) => t.state === "merged")
      .map((t) => 1 << t.power);

    if (powers.length === 0) return;

    setScore(score + powers.reduce((a, b) => a + b));
  }

  async function runAnimation() {
    setAnimPhase("moving");
    if (
      tiles.filter((t) => t.state === "moved" || t.state === "mergeMoved")
        .length > 0
    ) {
      await delay(moveTimeMs * 0.9);
    }

    setAnimPhase("spawning");
    if (
      tiles.filter((t) => t.state === "merged" || t.state === "spawned")
        .length > 0
    ) {
      await delay(spawnTimeMs * 0.9);
    }

    setAnimPhase("idle");
  }

  function moveWrapper(dir: Direction) {
    if (animPhase !== "idle") return;

    const newTiles = move(tiles, dir);

    if (!newTiles.some(t => t.state === "moved" || t.state === "mergeMoved")) return;

    setTiles(newTiles);
    runAnimation().then(() => {
      addScore(newTiles);
    });
  }

  return {
    tiles: tiles,
    move: moveWrapper,
    score,
    newGame,
  };
}

export default useGame;

import TileView from "./TileView.tsx";
import useKeyboard from "../hooks/useKeyboard.tsx";
import useSwipe from "../hooks/useSwipe.tsx";
import type { AnimPhase, Direction, Tile } from "../types.ts";
import useTileSizeGap from "../hooks/useTileSizeGap.tsx";
import { copyTile } from "../util.ts";

interface Props {
  tiles: Tile[];
  animPhase: AnimPhase;
  move: (dir: Direction) => void;
  tileColors: readonly string[];
}

function GameBoard({ tiles, animPhase, move, tileColors }: Props) {
  const { swipeStart, swipeEnd } = useSwipe(move);
  useKeyboard(move);

  const { tileSize, gap } = useTileSizeGap();
  console.log(tileSize + " " + gap);

  switch (animPhase) {
    case "idle":
      tiles = tiles.filter((t) => t.state !== "mergeMoved");
      tiles = tiles.map((t) => copyTile(t, { state: "unmodified" }));
      break;

    case "moving":
      tiles = tiles.filter(
        (t) =>
          t.state === "unmodified" ||
          t.state === "moved" ||
          t.state === "mergeMoved",
      );
      break;

    case "spawning":
      tiles = tiles.filter((t) => t.state !== "mergeMoved");
      break;
  }

  return (
    <>
      <div
        className="board"
        onTouchStart={swipeStart}
        onTouchEnd={swipeEnd}
        onMouseDown={swipeStart}
        onMouseUp={swipeEnd}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="cell" />
        ))}

        {tiles.map((t) => (
          <TileView
            key={t.id}
            tile={t}
            specialClass={t.state}
            tileColors={tileColors}
            posMultiplier={tileSize + gap}
          />
        ))}
      </div>
    </>
  );
}

export default GameBoard;

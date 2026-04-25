import "./index.css";
import useTheme from "./hooks/useTheme.tsx";
import GameHeader from "./components/GameHeader.tsx";
import GameBoard from "./components/GameBoard.tsx";
import useGame from "./hooks/useGame.tsx";
import {useEffect, useState} from "react";
import type {AnimPhase} from "./types.ts";

const TILE_MOVE_TIME_MS = 200;
const TILE_SPAWN_TIME_MS = 200;

function App() {
    const theme = useTheme();
    const [animPhase, setAnimPhase] = useState<AnimPhase>("idle");
    const {gameState, move, score, newGame} = useGame(
        animPhase, setAnimPhase, TILE_MOVE_TIME_MS, TILE_SPAWN_TIME_MS
    );

    useEffect(() => {
        const style = document.documentElement.style;

        style.setProperty("--tile-move-time", `${TILE_MOVE_TIME_MS}ms`);
        style.setProperty("--tile-spawn-time", `${TILE_SPAWN_TIME_MS}ms`);
    });

    return (
        <div className="game">
            <header>
                <GameHeader score={score} bestScore={0} newGameCallback={newGame}/>
            </header>
            <main>
                <GameBoard gameState={gameState} animPhase={animPhase} move={move} tileColors={theme.tileColors}/>
            </main>
        </div>
    );
}

export default App;

import "./index.css";
import { themes } from "./themes";
import GameBoard from "./components/GameBoard.tsx";

function Example() {
  return (
    <>
      <header>
        <nav style={{ color: themes.light.title }}>
          <ul>
            <li>
              <span>2048</span>
            </li>
            <li>
              <span>Score: 0</span>
            </li>
            <li>
              <span>Best Score: 0</span>
            </li>
            <li>
              <span>New Game</span>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <GameBoard onTileMove={() => {}} onTileMerge={() => {}}/>
      </main>
      <footer></footer>
    </>
  );
}

export default Example;

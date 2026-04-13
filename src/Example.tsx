import "./index.css";
import { themes } from "./themes";

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
        <div className="board">
          <div
            className="tile"
            style={{ background: themes.light.board_background }}
          ></div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[0] }}
          >
            2
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[1] }}
          >
            4
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[2] }}
          >
            8
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[3] }}
          >
            16
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[4] }}
          >
            32
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[5] }}
          >
            64
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[6] }}
          >
            128
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[7] }}
          >
            256
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[8] }}
          >
            512
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[9] }}
          >
            1024
          </div>
          <div
            className="tile"
            style={{ background: themes.light.tileColors[10] }}
          >
            2048
          </div>
          <div
            className="tile"
            style={{ background: themes.light.board_background }}
          ></div>
          <div
            className="tile"
            style={{ background: themes.light.board_background }}
          ></div>
          <div
            className="tile"
            style={{ background: themes.light.board_background }}
          ></div>
          <div
            className="tile"
            style={{ background: themes.light.board_background }}
          ></div>
        </div>
      </main>
      <footer></footer>
    </>
  );
}

export default Example;

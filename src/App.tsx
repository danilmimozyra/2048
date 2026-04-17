import "./index.css";
import { themes } from "./themes";
import { useState, useEffect } from "react";

function App() {
  const [themeName, setThemeName] = useState<"light" | "dark">("light");
  const theme = themes[themeName];

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      setThemeName(media.matches ? "dark" : "light");
    };

    updateTheme();

    media.addEventListener("change", updateTheme);

    return () => media.removeEventListener("change", updateTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--board", theme.board);
    root.style.setProperty("--title", theme.title);
  }, [theme]);

  const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 0, 0, 0];

  return (
    <div
      className="game"
      style={{ background: theme.background, color: theme.title }}
    >
      <header className="header">
        <h1 className="title">2048</h1>

        <div className="scores">
          <div className="score-box">
            <span>
              Score: <strong>0</strong>
            </span>
          </div>

          <div className="score-box">
            <span>
              Best: <strong>0</strong>
            </span>
          </div>
        </div>

        <button className="new-game-btn">New Game</button>
      </header>

      <main>
        <div className="board" style={{ background: theme.board }}>
          {tiles.map((item) => (
            <div
              className="tile"
              style={{
                background: theme.tileColors[item],
                color: theme.title,
              }}
            >
              {item != 0 ? 1 << item : ""}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

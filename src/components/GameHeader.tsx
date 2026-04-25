interface Props {
    score: number;
    bestScore: number;
    newGameCallback: () => void;
}

function GameHeader({ score, bestScore, newGameCallback }: Props) {
    return (
        <>
            <h1 className="title">2048</h1>
            <div className="scores">
                <div className="score-box">
                    <span>Score: <strong>{score}</strong></span>
                </div>

                <div className="score-box">
                    <span>
                      Best: <strong>{bestScore}</strong>
                    </span>
                </div>
            </div>

            <button className="new-game-btn" onClick={newGameCallback}>New Game</button>
        </>
    )
}

export default GameHeader;
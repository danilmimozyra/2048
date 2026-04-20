import {useEffect} from "react";
import type {Direction} from "../types.ts";

function useKeyboard(move: (direction: Direction) => void) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            console.log("handleKey", e);
            switch (e.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    move("up");
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    move("down");
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    move("left");
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    move("right");
                    break;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [move]);
}

export default useKeyboard;
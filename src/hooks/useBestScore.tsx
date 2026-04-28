import { useState } from "react";

function useBestScore(score: number) {
  const localStorageKey: string = "bestScore";

  function setLocalBestScore(score: number) {
    localStorage.setItem(localStorageKey, String(score));
  }

  function getLocalBestScore(): number {
    const s = localStorage.getItem(localStorageKey);

    if (s === null) {
      setLocalBestScore(0);
      return 0;
    }

    return Number(s);
  }

  const [bestScore, setBestScore] = useState<number>(() => getLocalBestScore());

  if (score > bestScore) {
    setLocalBestScore(score);
    setBestScore(score);
  }

  return bestScore;
}

export default useBestScore;

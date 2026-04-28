import { useEffect, useState } from "react";

function useTileSizeGap() {
  const [tileSize, setTileSize] = useState(0);
  const [gap, setGap] = useState(0);

  useEffect(() => {
    const stripPx = (s: string) => Number(s.substring(0, s.length - 2));

    const style = getComputedStyle(document.documentElement);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTileSize(stripPx(style.getPropertyValue("--tile-size")));
    setGap(stripPx(style.getPropertyValue("--gap")));
  }, []);

  return { tileSize, gap };
}

export default useTileSizeGap;

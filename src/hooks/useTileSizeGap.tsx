import {useEffect, useState} from "react";

function useTileSizeGap() {
    const [tileSize, setTileSize] = useState(0);
    const [gap, setGap] = useState(0);

    useEffect(() => {
        function updateSize() {
            const stripPx = (s: string) =>
                Number(s.substring(0, s.length - 2));

            const style = getComputedStyle(document.documentElement);

            setTileSize(stripPx(style.getPropertyValue("--tile-size")));
            setGap(stripPx(style.getPropertyValue("--gap")));
        }

        updateSize();
        window.addEventListener("resize", updateSize);

        return () => { window.removeEventListener("resize", updateSize); };
    }, []);

    return { tileSize, gap };
}

export default useTileSizeGap;
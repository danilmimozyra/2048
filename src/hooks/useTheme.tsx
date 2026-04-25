import {useEffect, useState} from "react";
import {themes} from "../themes.ts";
import type {Theme} from "../types.ts";

function useTheme(): Theme {
    const [theme, setTheme] = useState<Theme>(themes.light);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const updateTheme = () => {
            setTheme(media.matches ? themes.dark : themes.light);
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

    return theme;
}

export default useTheme;
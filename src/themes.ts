export const themes = {
  light: {
    background: "#ede8d0",
    board_background: "#d5b699",
    board: "#8f6a4f",
    title: "#230f08",

    tileColors: [
      "#d5b699",
      "#c79a74",
      "#f2b179",
      "#f59563",
      "#f67c5f",
      "#fb5030",
      "#ff2400",
      "#f4d03f",
      "#f1c40f",
      "#f39c12",
      "#e67e22",
      "#d35400",
      "#c0392b",
    ],
  },
  dark: {
    background: "#030712",
    board_background: "#708090",
    board: "#111827",
    title: "#f1f5f9",

    tileColors: [
      "#708090", // themes.dark.board_background
      "#273449",
      "#334155",
      "#3b4f8a",
      "#3b82f6",
      "#38bdf8",
      "#22d3ee",
      "#6366f1",
      "#8b5cf6",
      "#a855f7",
      "#d946ef",
      "#ec4899",
      "#f72585",
    ],
  },
} as const;

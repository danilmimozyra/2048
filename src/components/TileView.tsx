import type {Tile} from "../types.ts";

interface Props {
    tile: Tile;
    specialClass: string;
    tileColors: readonly string[];
    posMultiplier: number;
}

function TileView({ tile, specialClass, tileColors, posMultiplier }: Props) {
    const x = tile.col * posMultiplier;
    const y = tile.row * posMultiplier;

    return (
        <div
            className={`tile ${specialClass}`}
            style={{
                transform: `translate(${x}px, ${y}px)`,
                background: tileColors[tile.power],
            }}
        >
            {1 << tile.power}
        </div>
    );
}

export default TileView;
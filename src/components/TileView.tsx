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
            className="tile"
            style={{
                transform: `translate(${x}px, ${y}px)`,
            }}
        >
            <div
                className={`tile-inner ${specialClass}`}
                style={{
                    background: tileColors[tile.power],
                }}
            >
                {1 << tile.power}
            </div>
        </div>
    );
}

export default TileView;
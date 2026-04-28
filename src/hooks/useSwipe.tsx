import { useRef } from "react";
import * as React from "react";
import type { Direction } from "../types.ts";

function useSwipe<T extends React.MouseEvent | React.TouchEvent>(
  move: (direction: Direction) => void,
) {
  const swipe = useRef<{ x: number; y: number } | null>(null);

  function getXY(e: T) {
    e.preventDefault();

    if (e.nativeEvent instanceof MouseEvent) {
      const m = e as React.MouseEvent;
      return { x: m.clientX, y: m.clientY };
    } else if (e.nativeEvent instanceof TouchEvent) {
      const t = (e as React.TouchEvent).changedTouches[0];
      return { x: t.clientX, y: t.clientY };
    } else {
      throw new TypeError(`Unexpected event type ${e.type}`);
    }
  }

  function swipeStart(e: T) {
    swipe.current = getXY(e);
  }

  function swipeEnd(e: T) {
    if (!swipe.current) return;

    const c = getXY(e);
    const dx = c.x - swipe.current.x;
    const dy = c.y - swipe.current.y;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const threshold = 30;

    if (Math.max(absX, absY) < threshold) return;

    move(absX > absY ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");

    swipe.current = null;
  }

  return {
    swipeStart,
    swipeEnd,
  };
}

export default useSwipe;

import { useCallback, useRef } from "react";
import { STICKY_DISTANCE } from "../components/containers/consts";

type Position = { x: number; y: number };

type Props = {
  positions: Record<string, Position>;
  setPositions: React.Dispatch<React.SetStateAction<Record<string, Position>>>;
  fieldSize: number;
  squareSize: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSnap: () => void;
};

export const useSquareDragger = (props: Props) => {
  const {
    positions,
    setPositions,
    fieldSize,
    squareSize,
    containerRef,
    onSnap,
  } = props;

  const stickyRef = useRef<{ [id: string]: string | null }>({});

  const handleMouseDown = useCallback(
    (event: React.MouseEvent, id: string) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const activeSquare = positions[id];

      const cursorInSquareOffsetX = event.clientX - rect.left - activeSquare.x;
      const cursorInSquareOffsetY = event.clientY - rect.top - activeSquare.y;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        setPositions((prev) => {
          const activeSquare = prev[id];
          const otherId = Object.keys(prev).find((key) => key !== id);
          if (!otherId) return prev;
          const passiveSquare = prev[otherId];

          const targetX = moveEvent.clientX - rect.left - cursorInSquareOffsetX;
          const targetY = moveEvent.clientY - rect.top - cursorInSquareOffsetY;

          let dx = targetX - activeSquare.x;
          let dy = targetY - activeSquare.y;

          if (stickyRef.current[id] === otherId) {
            const minXActive = -activeSquare.x;
            const maxXActive = fieldSize - squareSize - activeSquare.x;
            const minYActive = -activeSquare.y;
            const maxYACtive = fieldSize - squareSize - activeSquare.y;

            const minXPassive = -passiveSquare.x;
            const maxXPassive = fieldSize - squareSize - passiveSquare.x;
            const minYPassive = -passiveSquare.y;
            const maxYPassive = fieldSize - squareSize - passiveSquare.y;

            dx = Math.max(
              Math.max(minXActive, minXPassive),
              Math.min(dx, Math.min(maxXActive, maxXPassive)),
            );
            dy = Math.max(
              Math.max(minYActive, minYPassive),
              Math.min(dy, Math.min(maxYACtive, maxYPassive)),
            );

            onSnap();
            return {
              ...prev,
              [id]: { x: activeSquare.x + dx, y: activeSquare.y + dy },
              [otherId]: { x: passiveSquare.x + dx, y: passiveSquare.y + dy },
            };
          }

          let newX = Math.max(0, Math.min(targetX, fieldSize - squareSize));
          let newY = Math.max(0, Math.min(targetY, fieldSize - squareSize));

          const isStickyX =
            (Math.abs(newX - (passiveSquare.x + squareSize)) <
              STICKY_DISTANCE ||
              Math.abs(newX + squareSize - passiveSquare.x) <
                STICKY_DISTANCE) &&
            newY < passiveSquare.y + squareSize &&
            newY + squareSize > passiveSquare.y;

          const isStickyY =
            (Math.abs(newY - (passiveSquare.y + squareSize)) <
              STICKY_DISTANCE ||
              Math.abs(newY + squareSize - passiveSquare.y) <
                STICKY_DISTANCE) &&
            newX < passiveSquare.x + squareSize &&
            newX + squareSize > passiveSquare.x;

          if (isStickyX) {
            if (
              Math.abs(activeSquare.x + squareSize - passiveSquare.x) <
              STICKY_DISTANCE
            ) {
              newX = passiveSquare.x - squareSize;
            } else if (
              Math.abs(activeSquare.x - (passiveSquare.x + squareSize)) <
              STICKY_DISTANCE
            ) {
              newX = passiveSquare.x + squareSize;
            }
          }

          if (isStickyY) {
            if (
              Math.abs(activeSquare.y + squareSize - passiveSquare.y) <
              STICKY_DISTANCE
            ) {
              newY = passiveSquare.y - squareSize;
            } else if (
              Math.abs(activeSquare.y - (passiveSquare.y + squareSize)) <
              STICKY_DISTANCE
            ) {
              newY = passiveSquare.y + squareSize;
            }
          }

          const newPositions: Record<string, Position> = {
            ...prev,
            [id]: { x: newX, y: newY },
          };

          if (isStickyX || isStickyY) {
            stickyRef.current[id] = otherId;
            stickyRef.current[otherId] = id;

            if (isStickyX) {
              const isLeft = newX < passiveSquare.x;
              newPositions[otherId] = {
                x: isLeft ? newX + squareSize : newX - squareSize,
                y: passiveSquare.y + (targetY - activeSquare.y),
              };
            }

            if (isStickyY) {
              const isTop = newY < passiveSquare.y;
              newPositions[otherId] = {
                x:
                  newPositions[otherId]?.x ??
                  passiveSquare.x + (targetX - activeSquare.x),
                y: isTop ? newY + squareSize : newY - squareSize,
              };
            }

            onSnap();
          } else {
            stickyRef.current[id] = null;
            stickyRef.current[otherId] = null;
          }

          return newPositions;
        });
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [positions, setPositions, fieldSize, squareSize, containerRef, onSnap],
  );

  const resetSticky = useCallback(() => {
    stickyRef.current = {};
  }, []);

  return { handleMouseDown, resetSticky };
};

import { useState } from "react";

export type Position = {
  x: number;
  y: number;
};

type Props = {
  fieldSize: number;
  squareSize: number;
  margin: number;
};

export const useSquareGenerator = ({
  fieldSize,
  squareSize,
  margin,
}: Props) => {
  const [positions, setPositions] = useState<Record<string, Position>>(() => {
    const generateCoords = (existing?: Position): Position => {
      const maxCoord = fieldSize - squareSize;

      while (true) {
        const x = Math.floor(Math.random() * maxCoord);
        const y = Math.floor(Math.random() * maxCoord);

        if (!existing) return { x, y };

        const hasCollision = !(
          x + squareSize + margin < existing.x ||
          x > existing.x + squareSize + margin ||
          y + squareSize + margin < existing.y ||
          y > existing.y + squareSize + margin
        );

        if (!hasCollision) return { x, y };
      }
    };

    const coords1 = generateCoords();
    const coords2 = generateCoords(coords1);

    return {
      1: coords1,
      2: coords2,
    };
  });

  return { positions, setPositions };
};

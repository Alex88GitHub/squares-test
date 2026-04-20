import { useRef, useState } from "react";
import styles from "./container.module.css";
import { Field } from "../blocks/field/field";
import { Actions } from "../blocks/actions/actions";
import {
  useSquareGenerator,
  type Position,
} from "../../hooks/useSquaresGenerator";
import { FIELD_SIZE, MARGIN, SQUARE_SIZE } from "./consts";
import { useSquareDragger } from "../../hooks/useSquareDragger";

export type Blocks = {
  id: string;
}[];

export type Colors = {
  id: string;
}[];

const blocks: Blocks = [
  {
    id: "1",
  },
  {
    id: "2",
  },
];

const colors: Colors = [
  {
    id: "1",
  },
  {
    id: "2",
  },
  {
    id: "3",
  },
];

export type Settings = {
  isActive: boolean;
  colorId?: string;
};

export const Container = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [squareColors, setSquareColors] = useState<Record<string, string>>({});
  const [isSticky, setIsSticky] = useState(false);

  const { positions, setPositions } = useSquareGenerator({
    fieldSize: FIELD_SIZE,
    squareSize: SQUARE_SIZE,
    margin: MARGIN,
  });

  const { handleMouseDown, resetSticky } = useSquareDragger({
    positions,
    setPositions,
    fieldSize: FIELD_SIZE,
    squareSize: SQUARE_SIZE,
    containerRef,
    onSnap: () => setIsSticky(true),
  });

  const onChangeActiveState = (id: string) => {
    setSelectedId(id);
  };

  const onChangeColor = (colorId: string) => {
    if (selectedId) {
      setSquareColors((prev) => ({
        ...prev,
        [selectedId]: colorId,
      }));
    }
  };

  const handleUnlinkSquares = () => {
    setIsSticky(false);
    resetSticky();
    setPositions((prevPositions) => {
      const generateCoords = (existing?: Position): Position => {
        const maxCoord = FIELD_SIZE - SQUARE_SIZE;

        while (true) {
          const x = Math.floor(Math.random() * maxCoord);
          const y = Math.floor(Math.random() * maxCoord);

          if (!existing) return { x, y };

          const hasCollision = !(
            x + SQUARE_SIZE + MARGIN < existing.x ||
            x > existing.x + SQUARE_SIZE + MARGIN ||
            y + SQUARE_SIZE + MARGIN < existing.y ||
            y > existing.y + SQUARE_SIZE + MARGIN
          );

          if (!hasCollision) return { x, y };
        }
      };

      const ids = Object.keys(prevPositions);
      const newPositions: Record<string, Position> = {};

      ids.forEach((id, index) => {
        if (index === 0) {
          newPositions[id] = generateCoords();
        } else {
          newPositions[id] = generateCoords(newPositions[ids[index - 1]]);
        }
      });

      return newPositions;
    });
  };

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <Field
        positions={positions}
        colors={squareColors}
        blocks={blocks}
        selectedId={selectedId}
        onChange={onChangeActiveState}
        onMouseDown={handleMouseDown}
      />
      <Actions
        colors={colors}
        onChangeColor={onChangeColor}
        showUnlinkButton={isSticky}
        onUnlinkClick={handleUnlinkSquares}
      />
    </div>
  );
};

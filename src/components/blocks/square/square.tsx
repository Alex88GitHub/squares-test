import cn from "classnames";
import styles from "./square.module.css";
import type { Position } from "../../../hooks/useSquaresGenerator";

type Props = {
  position: Position;
  isSelected: boolean;
  colorId?: string;
  onChange: () => void;
  onMouseDown: (event: React.MouseEvent) => void;
};

export const Square = (props: Props) => {
  const { position, isSelected, colorId, onChange, onMouseDown } = props;

  return (
    <div
      className={cn(
        `${styles.block} ${colorId ? styles[`color-${colorId}`] : ""}`,
        {
          [styles["is-active"]]: isSelected,
        },
      )}
      onClick={onChange}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};

import type { Position } from "../../../hooks/useSquaresGenerator";
import type { Blocks } from "../../containers/container";
import { Square } from "../square/square";
import styles from "./field.module.css";

type Props = {
  positions: Record<string, Position>;
  blocks: Blocks;
  colors: Record<string, string>;
  selectedId: string | null;
  onChange: (id: string) => void;
  onMouseDown: (event: React.MouseEvent, id: string) => void;
};

export const Field = (props: Props) => {
  const { positions, blocks, colors, selectedId, onChange, onMouseDown } =
    props;

  return (
    <div className={styles.field}>
      {blocks.map((block) => (
        <Square
          position={positions[block.id]}
          key={block.id}
          isSelected={selectedId === block.id}
          colorId={colors[block.id]}
          onChange={() => onChange(block.id)}
          onMouseDown={(event) => onMouseDown(event, block.id)}
        />
      ))}
    </div>
  );
};

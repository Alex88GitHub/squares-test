import type { Colors } from "../../containers/container";
import styles from "./actions.module.css";

type Props = {
  colors: Colors;
  onChangeColor: (colorId: string) => void;
  showUnlinkButton: boolean;
  onUnlinkClick: () => void;
};

export const Actions = (props: Props) => {
  const { colors, onChangeColor, showUnlinkButton, onUnlinkClick } = props;

  return (
    <div>
      <div className={styles.container}>
        <h2>Выберите цвет</h2>
        <div className={styles["color-wrapper"]}>
          {colors.map((color, index) => (
            <button
              key={index}
              type="button"
              className={`${styles[`color-${color.id}`]} ${styles["color-example"]}`}
              onClick={() => onChangeColor(color.id)}
            />
          ))}
        </div>
      </div>
      {showUnlinkButton && (
        <button
          className={styles["unlink-button"]}
          type="button"
          onClick={() => onUnlinkClick()}
        >
          Разъединить
        </button>
      )}
    </div>
  );
};

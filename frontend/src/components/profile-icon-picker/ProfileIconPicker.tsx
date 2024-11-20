import useApi from "../../api/useApi.ts";
import { userActions, useUser } from "../../store/userSlice.ts";
import MainTitle from "../MainTitle.tsx";
import { Modal } from "react-bootstrap";
import styles from "./ProfileIconPicker.module.scss";
import { FaCheck } from "react-icons/fa6";
import { getTextColor } from "../../utils/utils.ts";
import { useEffect, useState } from "react";
import getApi from "../../api/axios.ts";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function ProfileIconPicker(props: Props) {
  const { data: colors } = useApi<string[]>("/colors", "get");
  const user = useUser();
  const dispatch = useDispatch();
  const [currentColor, setCurrentColor] = useState<string | null | undefined>(user.iconColor);

  useEffect(() => {
    setCurrentColor(user.iconColor);
  }, [props.visible, user.iconColor]);

  function onColorClick(color: string) {
    setCurrentColor(color);
  }

  async function save() {
    if (!currentColor) {
      props.setVisible(false);
      return;
    }

    getApi().post("/users/change-color", { color: currentColor })
      .then((response) => {
        if(response.status !== 200) {
          toast.error("Wystąpił błąd podczas zmiany koloru");
          return;
        }

        dispatch(userActions.setColor(currentColor));
        props.setVisible(false);
      })
      .catch(() => {
        toast.error("Wystąpił błąd podczas zmiany koloru");
      })

  }

  return (
    <Modal show={props.visible} onHide={() => props.setVisible(false)} centered>
      <Modal.Body>
        <MainTitle>Wybór koloru</MainTitle>
      </Modal.Body>
      <Modal.Body>
        <div className={styles.iconPicker}>
          {colors?.map((color, index) => {
            const selected = currentColor?.toLowerCase() === color.toLowerCase();
            const textColor = selected ? getTextColor(color) : color;

            return (
              <div
                key={`${index}-${color}`}
                className={`${styles.icon} ${selected ? styles.selected : ""}`}
                onClick={() => onColorClick(color)}
                style={{
                  backgroundColor: color,
                  color: textColor,
                }}
              >
                <FaCheck/>
              </div>
            );
          })}
        </div>
        <div className={styles.buttons}>
          <button className={"button primary"} onClick={save}>
            Zapisz
          </button>
          <button className={"button secondary"} onClick={() => props.setVisible(false)}>
            Anuluj
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
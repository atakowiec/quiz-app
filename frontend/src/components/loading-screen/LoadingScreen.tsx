import { AiOutlineLoading3Quarters } from "react-icons/ai"
import styles from "./LoadingScreen.module.scss"
import { CSSProperties, useEffect, useState } from "react";

type LoadingScreenProps = {
  attempt: number
  visible?: boolean
}

export default function LoadingScreen({ attempt, visible }: LoadingScreenProps) {
  const [display, setDisplay] = useState(true)

  useEffect(() => {
    if(!visible && display)
      setTimeout(() => setDisplay(false), 500)

  }, [visible]);

  if(!display) return null

  function getStyle(): CSSProperties {
    return {
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "all" : "none"
    }
  }

  return (
    <div className={styles.loadingScreen} style={getStyle()}>
      <div className={styles.logo}>
        Quiz Base
      </div>
      <div className={styles.loadingInfo}>
        <div className={styles.line}></div>
        Ładowanie
        <div className={styles.line}></div>
      </div>
      <div className={styles.loadingAnimation}>
        <AiOutlineLoading3Quarters/>
      </div>
      {attempt > 3 &&
        (<div className={styles.additionalInfo}>
          Hmm, zajmuje to dłużej niż zwykle.
          <br />
          Spróbuj odświeżyć stronę.
        </div>)}
    </div>
  )
}
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import styles from "./LoadingScreen.module.scss"

type LoadingScreenProps = {
  attempt: number
  empty: boolean // this is used to omit the loading screen when the app is loading for the first time - to prevent flashing
}

export default function LoadingScreen({ attempt, empty }: LoadingScreenProps) {
  if (empty) {
    return (
      <div className={styles.loadingScreen}>
      </div>
    )
  }

  return (
    <div className={styles.loadingScreen}>
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
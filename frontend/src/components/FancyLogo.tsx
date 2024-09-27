import { Link } from "react-router-dom";
import styles from "../styles/Header.module.scss";
import { useRef, useState } from "react";

export default function FancyLogo() {
  const hoveredRef = useRef<boolean>(false);
  const [counter, setCounter] = useState<number>(10);
  const intervalRef = useRef<any>(-1);

  function onMouseEnter() {
    hoveredRef.current = true;
    incrementCounter();

    intervalRef.current = setInterval(() => {
      if (!hoveredRef.current)
        clearInterval(intervalRef.current);

      incrementCounter();
    }, 150);
  }

  function onMouseLeave() {
    hoveredRef.current = false;
    clearInterval(intervalRef.current);
    incrementCounter();
  }

  function incrementCounter() {
    setCounter(prev => prev + 1);
  }

  function getCharStyle(index: number) {
    if (!hoveredRef.current) return {};

    let color = [6, 165, 59];
    color[(counter - index) % 3] = 255;
    const distance = Math.abs(counter % 9 - index);

    const tranlate = [15, 10, 5][distance] ?? 0;

    return {
      color: `rgb(${color.join(",")})`,
      marginTop: `${-tranlate}px`,
      paddingBottom: `${tranlate}px`,
    };
  }

  return (
    <Link to="/"
          className={`${styles.logo} ${styles.fancyLogo}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
      {"Quiz Base".split("").map((c, index) => (
        <div
          style={getCharStyle(index)}
          className={c == " " ? styles.space : ""}
          key={index}>
          {c}
        </div>
      ))}
    </Link>
  )
}
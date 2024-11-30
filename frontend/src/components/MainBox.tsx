import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { useGame } from "../store/gameSlice.ts";

type MainContainerProps = {
  children: ReactNode;
  className?: string;
  before?: ReactElement;
  after?: ReactNode;
}

export default function MainBox({ children, className, before, after }: MainContainerProps) {
  const beforeRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);
  const game = useGame();
  const inGame = game && game.status != "waiting_for_players";

  useEffect(() => {
    const onResize = () => {
      if (!beforeRef.current || beforeRef.current.clientHeight === height) {
        return;
      }

      // this set state occurs only when the height of the before element changes
      setHeight(beforeRef.current.clientHeight);
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [beforeRef.current?.clientHeight]);

  function getStyle() {
    let finalHeight = height;
    // if user is not in game - subtract sidebar height when on mobile
    // i knot its disgusting to put it here but i dont have a better idea
    if(document.body.clientWidth < 768 && !inGame) {
      finalHeight = height + 50;
    }

    if(!finalHeight)
      return { maxHeight: `calc(100dvh - 6rem)` }

    return { maxHeight: `calc(100dvh - 7rem - ${finalHeight}px)` }
  }

  return (
    <div>
      {before && <div ref={beforeRef}>{before}</div>}
      <div className={`mainBox ${className ?? ""}`} style={getStyle()}>
        {children}
      </div>
      {after}
    </div>
  );
}
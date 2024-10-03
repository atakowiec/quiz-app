import { ReactNode } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./GameAnimatedWrapper.scss";

type GameAnimatedWrapperProps = {
  keyProp: string
  children: ReactNode;
}

export default function GameAnimatedWrapper({ children, keyProp }: GameAnimatedWrapperProps) {
  return (
    <TransitionGroup>
      <CSSTransition
        key={keyProp}
        timeout={400}
        classNames="view"
      >
        <div className={"view"}>
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
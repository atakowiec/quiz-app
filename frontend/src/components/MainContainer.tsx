import { ReactNode } from "react";

type MainContainerProps = {
  children: ReactNode;
  className?: string;
}

export default function MainContainer({ children, className }: MainContainerProps) {
  return (
    <div className={`mainContainer ${className ?? ""}`}>
      {children}
    </div>
  );
}
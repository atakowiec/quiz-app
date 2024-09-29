import { ReactNode } from "react";

type MainContainerProps = {
  children: ReactNode;
  className?: string;
  before?: ReactNode;
  after?: ReactNode;
}

export default function MainBox({ children, className, before, after }: MainContainerProps) {
  return (
    <div>
      {before}
      <div className={`mainBox ${className ?? ""}`}>
        {children}
      </div>
      {after}
    </div>
  );
}
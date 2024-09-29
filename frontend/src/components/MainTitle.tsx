import { ReactNode } from "react";

export default function MainTitle({ children }: { children: ReactNode }) {
  return <div className="mainText">{children}</div>
}
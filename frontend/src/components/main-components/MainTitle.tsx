import { ReactNode } from "react";

export default function MainTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mainText ${className}`}>{children}</div>;
}

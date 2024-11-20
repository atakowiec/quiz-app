import { useMemo } from "react";
import { getTextColor } from "../utils/utils.ts";

type Props = {
  username?: string;
  iconColor?: string;
  className: string;
  onClick?: () => void;
}

export default function ProfileIcon(props: Props) {
  const fontColor = useMemo(() => {
    if (!props.iconColor)
      return "#000"

    return getTextColor(props.iconColor)
  }, [props.iconColor])

  return (
    <div className={props.className} style={{ backgroundColor: props.iconColor, color: fontColor }} onClick={props.onClick}>
      {props.username?.[0]?.toUpperCase() ?? "-"}
    </div>
  )
}
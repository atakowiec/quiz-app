import { useMemo } from "react";

type Props = {
  username?: string;
  iconColor?: string;
  className: string;
}

export default function ProfileIcon(props: Props) {
  const fontColor = useMemo(() => {
    if (!props.iconColor)
      return "#000"

    const hex = props.iconColor.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

    return luminance > 0.5 ? "#000" : "#fff";
  }, [props.iconColor])

  return (
    <div className={props.className} style={{ backgroundColor: props.iconColor, color: fontColor }}>
      {props.username?.[0]?.toUpperCase() ?? "-"}
    </div>
  )
}
import { useUser } from "../store/userSlice.ts";
import { useGame } from "../store/gameSlice.ts";
import { SidebarItem } from "../components/SideBar.tsx";
import { IoHomeSharp, IoSettingsSharp, IoStatsChartSharp } from "react-icons/io5";
import { IoIosAddCircleOutline, IoIosPlay, IoIosSend, IoLogoGameControllerB } from "react-icons/io";


export function useGameSidebarItems(openInviteModal: () => void): SidebarItem[] {
  return [
    { icon: IoHomeSharp, label: "Powrót", href: "/" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
    { icon: IoIosSend, label: "Zaproś", href: "", onClick: openInviteModal },
  ];
}

export function useSidebarItems(): SidebarItem[] {
  const loggedIn = useUser().loggedIn;
  const game = useGame();

  const result: SidebarItem[] = [];

  if (game?.status !== "waiting_for_players") {
    result.push(
      { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game", },
      { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
    );
  } else {
    result.push({ icon: IoIosPlay, label: "Wróć do gry", href: "/waiting-room" });
  }

  if (loggedIn) {
    result.push(
      { icon: IoLogoGameControllerB, label: "Historia Gier", href: "/history", },
      { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" }
    );
  }

  return result;
}
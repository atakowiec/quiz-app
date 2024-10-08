import { useContext } from "react";
import { ProfileModalContext } from "./ProfileModalProvider.tsx";

export default function useProfileModal() {
  return useContext(ProfileModalContext)!;
}
import { UserStatus } from "@shared/user";

export function translateUserStatus(status: UserStatus) {
  return {
    online: "Online",
    offline: "Offline",
    ingame: "W grze"
  }[status];
}
export type UserPacket = {
  id: number;
  username: string;
  email: string;
  permission: number;
  iconColor: string;
}

export enum PermissionEnum {
    USER = 0,
    ADMIN = 1,
}
export type UserStatus = "online" | "offline" | "ingame"

/**
 * This is the status of the friendship between two users
 * friend - the users are friends
 * pending - the user has pending friend request from the other user
 * requested - the user has sent a friend request to the other user
 * none - the users are not friends and there is no request between them
 */
export type FriendshipStatus = "friend" | "pending" | "requested" | "none"

/**
 * Data about the user that is available to all logged-in users
 */
export type UserDetails = {
  id: number;
  username: string;
  iconColor: string;
  stats: {
    playedGames: number
    firstPlace: number
    secondPlace: number
    thirdPlace: number
  }
}

/**
 * This is simplified version of the user data
 */
export type BasicUserDetails = {
  id: number;
  username: string;
  iconColor: string;
}
export type UserPacket = {
  id: number;
  username: string;
  email: string;
  permission: number;
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
 * This is per sender data about the user - the content depends on the sender and the receiver
 * Contains all the information about the user that is needed for the sender
 */
export type UserDetails = {
  id: number;
  username: string;
  email: string;
  status: UserStatus;
  friendship: {
    status: FriendshipStatus
    since?: string
  }
  stats: {
    playedGames: number
    firstPlace: number
    secondPlace: number
    thirdPlace: number
  }
}
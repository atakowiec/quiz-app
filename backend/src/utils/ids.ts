import { customAlphabet } from "nanoid";

export const createGameID = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6
);

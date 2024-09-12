import {Request as Req} from 'express'
import {TokenPayload} from "./auth/auth";

/**
 * This type extends the Request type from Express to include a cookies object with an access_token property so typescript won't scream at us.
 */
export type Request = Req & {
  user?: TokenPayload
  cookies: {
    access_token: string;
  }
}
import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
        id: number;
        profile_img: stringnumber;
        name: stringnumber;
        email: stringnumber;
        email_verified: booleannumber;
        roles: number[];
    }
  }
}
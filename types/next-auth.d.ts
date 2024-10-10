import NextAuth, {DefaultSession} from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        jwt: any
        exp: number
    }

    interface User {
        id: string
        token: string
        exp: number
    }
}
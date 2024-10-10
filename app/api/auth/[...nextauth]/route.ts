import NextAuth, {NextAuthOptions} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {doLoginOfEmail} from "@/app/actions/login";

const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                email: {label: 'E-Mail', type: 'email'},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {

                const resp = await doLoginOfEmail(credentials)

                if (resp && credentials?.email) {
                    return {id: credentials.email, token: resp.token, exp: resp.lifetime}
                }

                return null
            }
        }),
    ],
    callbacks: {
        async jwt({token, user}) {

            if (user) {
                token.email = user.id
                token.jwt = user.token; // 将 JWT 存入 token
                token.exp = Math.floor(Date.now() / 1000) + user.exp
            }

            return token;
        },
        async session({session, token}) {

            session.user = {email: token.email}
            session.jwt = token.jwt;

            return session
        }
    },
    jwt: {
        maxAge: process.env.NEXTAUTH_LIFETIME ? parseInt(process.env.NEXTAUTH_LIFETIME, 10) : undefined,
    },
    pages: {
        signIn: '/login'
    },
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
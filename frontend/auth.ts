import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Simple auth - in production, verify against Supabase
                if (credentials?.email && credentials?.password) {
                    return {
                        id: "1",
                        name: "User",
                        email: credentials.email as string,
                    }
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth
        },
    },
})

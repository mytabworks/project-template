import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import Route from "@route"
import User from "@model/User"

const maxAge = 30 * 24 * 60 * 60 // 30 days

export const nextAuthOptions: NextAuthOptions = {
    session: {
        // Choose how you want to save the user session.
        strategy: "jwt",
      
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge, 
      
        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge,
        // You can define your own encode/decode functions for signing and encryption
        // if you want to override the default behavior.
        // async encode({ secret, token, maxAge }) {},
        // async decode({ secret, token }) {},
    },
    callbacks: {
        async jwt({ token, account }) {
          // Persist the OAuth access_token to the token right after signin
          if (account) {
            token.accessToken = account.access_token
          }
          return token
        },

        async session({session, token, user}) {
            // Send properties to the client, like an access_token from a provider.
            session = {
                ...session,
                accessToken: token.accessToken
            }

            if(token.sub) {
                const dbUser = await User.find(token.sub, ['id'], {
                    roles: ($query) => {
                        $query.select('id')
                    }
                })

                session = {
                    uid: dbUser.id,
                    roles: dbUser.$roles?.map((role) => role.id),
                    ...session,
                    accessToken: token.accessToken  
                }
            }

            return session
        }
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { 
                    label: "Username", 
                    type: "email",
                    required: true, 
                    placeholder: "name@email.com" 
                },
                password: { 
                    label: "Password", 
                    type: "password",
                    required: true, 
                }
            },
            async authorize(credentials, _request) {
            // You need to provide your own logic here that takes the credentials
            // submitted and returns either a object representing a user or value
            // that is false/null if the credentials are invalid.
            // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
            // You can also use the `req` object to obtain additional parameters
            // (i.e., the request IP address)
            const user = await User
                .select('id', 'name', 'email')
                .where('email', credentials?.username)
                .where('password', credentials?.password)
                .first()
        
            // If no error and we have user data, return it
            if (user.hasItem) {
                return user.toJSON()
            }
            // Return null if user data could not be retrieved
            return null
            }
        })
    ]
}

export default Route.custom(NextAuth(nextAuthOptions))
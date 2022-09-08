import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import User from "@model/User"
import UserProvider from "@model/UserProvider"
import { ConnectionPool } from "eloquents"
import { compare } from "bcryptjs"

const maxAge = 30 * 24 * 60 * 60 // 30 days

const nextAuthOptions: NextAuthOptions = {
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
                
                const dbUser = await User.find(token.sub, ['*'], {
                    roles: ($query) => {
                        $query.select('id')
                    }
                })

                session = {
                    ...session,
                    user: {
                        id: dbUser.id,
                        profile_img: dbUser.profile_img,
                        name: dbUser.name,
                        email: dbUser.email,
                        email_verified: dbUser.email_verified,
                        roles: dbUser.$roles?.map((role) => role.id),
                    } as any,
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
                    .select('id', 'name', 'email', 'password')
                    .where('email', credentials?.username)
                    .where('email_verified', true)
                    .first()
                    
                    // If no error and we have user data, return it
                if (user.hasItem) {
                    
                    const valid = await compare(credentials?.password || '', user.password || '')

                    if(valid) {

                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }

                    } else {

                        return null
                    }
                }
                // Return null if user data could not be retrieved
                return null
            }
        }),
        GoogleProvider({

            clientId: process.env.OAUTH_GOOGLE_ID!,
            clientSecret: process.env.OAUTH_GOOGLE_SECRET!,

            async profile(profile): Promise<any> {

                const connectionPool = new ConnectionPool()

                try {
                    await connectionPool.open()

                    const provider = await UserProvider
                        .where('uid', profile.sub)
                        .where('type', 'google')
                        .with('user')
                        .first()

                    if(provider.hasItem === false) {

                        const user = await User
                            .select('id')
                            .where('email', profile.email)
                            .first()

                        if(user.hasItem === true) {
                            
                            const newProvider = user.providers().create()
                            newProvider.type = 'google'
                            newProvider.uid = profile.sub
                            await newProvider.save()

                            if(user.email_verified === false) {

                                user.email_verified = true
                                await user.save()
                                
                            }

                            return {
                                id: user.id,
                                email: profile.email,
                                name: profile.name
                            }

                        } else {

                            const newUser = new User()
                            newUser.name = profile.name
                            newUser.email = profile.email
                            newUser.profile_img = profile.picture
                            newUser.email_verified = true
                            await newUser.save()

                            // role 3 is consumer
                            const newRole = await newUser.roles().findOrNew(3)
                            await newRole.save()

                            const newProvider = newUser.providers().create()
                            newProvider.type = 'google'
                            newProvider.uid = profile.sub
                            await newProvider.save()

                            return {
                                id: newUser.id,
                                email: profile.email,
                                name: profile.name
                            }
                        }

                    } else {

                        return {
                            id: provider.user_id,
                            email: provider.$user?.email,
                            name: provider.$user?.name
                            // Return all the profile information you need.
                            // The only truly required field is `id`
                            // to be able identify the account when added to a database
                        }

                    }

                } catch (error) {

                    console.error(error)
                } finally {

                    await connectionPool.close()
                }
                
            },
        })
    ]
}

export default nextAuthOptions
import Route from '@server/route'
import nextAuthOptions from '@server/utils/nextAuthOptions'
import NextAuth from 'next-auth'

export default Route.custom(NextAuth(nextAuthOptions))
import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import nextAuthOptions from "./nextAuthOptions"

export const getServerSession = async (ctx: {
    req: NextApiRequest;
    res: NextApiResponse;
}) => {
    
    return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions)
}

export type Session = (ReturnType<typeof getServerSession> extends Promise<infer R> ? R : any)

export type NextApiRequestWithSession = NextApiRequest & {
    session: Session
}
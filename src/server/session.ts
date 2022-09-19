import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import { Server } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import nextAuthOptions from "./utils/nextAuthOptions"

export const getServerSession = async (ctx: {
    req: NextApiRequest;
    res: NextApiResponse;
}) => {
    
    return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions)
}

export type Session = (ReturnType<typeof getServerSession> extends Promise<infer R> ? R : any)

export type NextApiRequestWithSession = NextApiRequest & {
    session: Session;
    socket: NextApiRequest["socket"] & {
        server: DefaultEventsMap & {
            io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
        }
    }
}
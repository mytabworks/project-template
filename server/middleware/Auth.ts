import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import BaseMiddleware from "./BaseMiddleware"

export type Session = (ReturnType<typeof getSession> extends Promise<infer R> ? R : any) & { 
    roles: number[];
    uid: number;
}

export class Auth extends BaseMiddleware {

    public static async handle(request: NextApiRequest, response: NextApiResponse<any>, authorizeRoleIDs: number[] | null): Promise<boolean> {

        const session = await getSession({ req: request }) as Session
        
        if(!session 
            || !(session 
                && Array.isArray(authorizeRoleIDs) 
                && authorizeRoleIDs.length > 0
                && session.roles.some((id) => authorizeRoleIDs.includes(id))
            )
        ) {

            this.unauthorized(response)

            return false
        }

        return true
    }

}
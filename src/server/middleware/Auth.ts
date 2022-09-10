import { NextApiRequest, NextApiResponse } from "next"
import BaseMiddleware from "./BaseMiddleware"
import { getServerSession, NextApiRequestWithSession } from "../session"

export class Auth extends BaseMiddleware {

    public static async handle(request: NextApiRequest, response: NextApiResponse<any>, authorizeRoleIDs: number[] | null): Promise<boolean> {

        const session = await getServerSession({ req: request, res: response })

        ;(request as NextApiRequestWithSession).session = session

        if(!session 
            || !(session 
                && (
                    (Array.isArray(authorizeRoleIDs) 
                        && authorizeRoleIDs.length > 0
                        && session.user?.roles.some((id) => authorizeRoleIDs.includes(id)
                    ) 
                    || authorizeRoleIDs === null
                )
            ))
        ) {

            this.unauthorized(response)

            return false
        }

        return true
    }

}
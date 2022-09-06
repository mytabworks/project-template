import { NextApiRequest, NextApiResponse } from "next";

class BaseMiddleware {

    /**
     * 
     * @param request 
     * @param response 
     * @param parameter 
     */
    public static async handle(request: NextApiRequest, response: NextApiResponse<any>, parameter: any): Promise<boolean> {
        return true
    }

    /**
     * method will return 404
     * @param request 
     * @param response 
     */
    public static missing(response: NextApiResponse<any>) {

        response.status(404).send({
            success: false,
            message: "Not Found"
        })
    }

    /**
     * method will return 405
     * @param request 
     * @param response 
     */
    public static notAllowed(response: NextApiResponse<any>) {

        response.status(405).send({
            success: false,
            message: "Method Not Allowed"
        })
    }

    /**
     * method will return 400
     * @param request 
     * @param response 
     */
    public static badRequest(response: NextApiResponse<any>) {

        response.status(400).send({
            success: false,
            message: "Bad Request"
        })
    }

    /**
     * method will return 401
     * @param request 
     * @param response 
     */
    public static unauthorized(response: NextApiResponse<any>) {

        response.status(401).send({
            success: false,
            message: "Unauthorized"
        })
    }

    /**
     * method will return 403
     * @param request 
     * @param response 
     */
    public static forbidden(response: NextApiResponse<any>) {

        response.status(403).send({
            success: false,
            message: "Forbidden"
        })
    }

     /**
     * method will return 500
     * @param request 
     * @param response 
     */
    public static error(response: NextApiResponse<any>) {

        response.status(500).send({
            success: false,
            message: "Internal Server Error"
        })

    }

}

export default BaseMiddleware
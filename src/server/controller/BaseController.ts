import { NextApiRequest, NextApiResponse } from "next";

class BaseController {

    /**
     * method will [GET] all the data
     * @param request 
     * @param response 
     */
    public static async index(request: NextApiRequest, response: NextApiResponse<any>) {
        
    }

    /**
     * method will [POST] and save an new data
     * @param request 
     * @param response 
     */
    public static async create(request: NextApiRequest, response: NextApiResponse<any>) {
        
    }

    /**
     * method will [GET] the data by {id}
     * @param request 
     * @param response 
     */
    public static async show(request: NextApiRequest, response: NextApiResponse<any>) {
        
    }

    /**
     * method will [PUT] and update the data by {id}
     * @param request 
     * @param response 
     */
    public static async update(request: NextApiRequest, response: NextApiResponse<any>) {
        
    }

    /**
     * method will [DELETE] the data by {id}
     * @param request 
     * @param response 
     */
    public static async destroy(request: NextApiRequest, response: NextApiResponse<any>) {
        
    }

}

export default BaseController
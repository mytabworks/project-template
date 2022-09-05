import BaseController from "@controller/BaseController"
import { NextApiRequest, NextApiResponse } from "next"
import Illusion from "illusionjs"
import * as AllMiddlewares from "@middleware/index"

type LowercaseKeys<R> = keyof { 
    [P in keyof R as `${Lowercase<P & string>}`]?: R;
}

type RequestMethodType = ("GET" | "POST" | "PUT" | "PATCH" | "DELETE")

class Route {

    protected middlewares?: string[]

    /**
     * 
     * @param middlewares 
     */
    public middleware(middlewares: LowercaseKeys<typeof AllMiddlewares>[]) {
        
        this.middlewares = middlewares

        return this
    }
    
    /**
     * 
     * @param request 
     * @param response 
     */
    protected async invokeMiddlewares(request: NextApiRequest, response: NextApiResponse<any>) {
        
        if(Array.isArray(this.middlewares) && this.middlewares.length > 0) {
                
            await Promise.all(this.middlewares.map((middleware) => {
                return AllMiddlewares[
                    middleware.replace(/^([a-z])/, (_, capital) => `${capital.toUpperCase()}`) as keyof typeof AllMiddlewares
                ]
                .handle(request, response)
            }))
        }
    }

    /**
     * method will set the route on CRUD 
     * @param request 
     * @param response 
     */
    public resource<C extends typeof BaseController>(controller: C, allowMethods: RequestMethodType[] = ["GET", "POST", "PUT", "PATCH", "DELETE"]) {
        return async (request: NextApiRequest, response: NextApiResponse<any>) => {
            
            if(allowMethods.includes(request.method as RequestMethodType) === false) {
                
                this.notAllowed(response)

            }

            await this.invokeMiddlewares(request, response)
            
            switch (request.method) {
                case "GET":
                    const { id } = request.query
    
                    if(!!id) {
                        controller.show(request, response)
    
                    } else {
                        controller.index(request, response)
    
                    }
                    
                    break;
                case "POST":
    
                    controller.create(request, response)
                    
                    break;
                case "PUT":
                case "PATCH":
    
                    if(!!id) {
                        controller.update(request, response)
    
                    } else {
                        this.badRequest(response)
    
                    }
                    
                    break;
                case "DELETE":
    
                    if(!!id) {
                        controller.destroy(request, response)
    
                    } else {
                        this.badRequest(response)
    
                    }
                    
                    break;
                default:
                    this.missing(response)
    
                    break;
            }
        }
    }

    /**
     * method [GET]
     * @param controller 
     * @param method 
     */
    public get<C extends typeof BaseController>(controller: C, method: keyof C) {

        return this.methodFactory(controller, method, "GET")
    }

    /**
     * method [POST]
     * @param controller 
     * @param method 
     */
    public post<C extends typeof BaseController>(controller: C, method: keyof C) {

        return this.methodFactory(controller, method, "POST")
    }

    /**
     * method [PUT]
     * @param controller 
     * @param method 
     */
    public put<C extends typeof BaseController>(controller: C, method: keyof C) {

        return this.methodFactory(controller, method, "PUT")
    }

    /**
     * method [PATCH]
     * @param controller 
     * @param method 
     */
    public patch<C extends typeof BaseController>(controller: C, method: keyof C) {

        return this.methodFactory(controller, method, "PATCH")
    }

    /**
     * method [DELETE]
     * @param controller 
     * @param method 
     */
    public delete<C extends typeof BaseController>(controller: C, method: keyof C) {

        return this.methodFactory(controller, method, "DELETE")
    }

    /**
     * 
     * @param controller 
     * @param controllerMethod 
     * @param requestMethod 
     */

    protected methodFactory<C extends typeof BaseController>(controller: C, controllerMethod: keyof C, requestMethod: RequestMethodType) {

        return async (request: NextApiRequest, response: NextApiResponse<any>) => {

            if(request.method === requestMethod) {

                await this.invokeMiddlewares(request, response)

                //@ts-ignore
                controller[controllerMethod](request, response)

            } else {

                this.notAllowed(response)
            }

        }
    }

    /**
     * method will return 404
     * @param request 
     * @param response 
     */
    public missing(response: NextApiResponse<any>) {

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
    public notAllowed(response: NextApiResponse<any>) {

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
    public badRequest(response: NextApiResponse<any>) {

        response.status(400).send({
            success: false,
            message: "Method Not Allowed"
        })

    }

     /**
     * method will return 500
     * @param request 
     * @param response 
     */
    public error(response: NextApiResponse<any>) {

        response.status(500).send({
            success: false,
            message: "Internal Server Error"
        })

    }

    public static __callStatic(method: string) {

        const instance: any = new Route()

        if(method in instance) {

            return (...parameters: any[]) => instance[method](...parameters)

        } else {

            throw Error(`Route has no method: ${method}`)
        }

    }
}

export default Illusion<InstanceType<typeof Route>>(Route)
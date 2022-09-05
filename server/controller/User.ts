import User from "@model/User"
import { ConnectionPool } from "eloquents"
import { NextApiRequest, NextApiResponse } from "next"
import Validozer from "validozer/esm"
import BaseController from "./BaseController"

class UserController extends BaseController {
    
    public static async index(_request: NextApiRequest, response: NextApiResponse<any>) {

        const connectionPool = new ConnectionPool()

        try {
            await connectionPool.open()
            
            const user = await User
                .with({
                    activities: (query) => {
                        query.cache(60000)
                    },
                    roles: (query) => {
                        query.cache(60000)
                    }
                })
                .cache(60000)
                .get()
                
            return response.status(200).send({
                success: true,
                data: user
            });
        } catch (error) {
            
            return response.status(500).send({
                success: false,
                message: error.message
            });
        } finally {
            
            await connectionPool.close()
        }
    }

    public static async show(request: NextApiRequest, response: NextApiResponse<any>) {

        const { id } = request.query as Record<string, string>
        
        try {
            const user = await User.find(id)

            if(!user.hasItem) {
                response.status(200).send({
                    success: false,
                    message: `User Not Found`
                })
            }

            return response.status(200).send({
                success: true,
                data: user.toJSON(),
            })

        } catch (error) {
            
            return response.status(500).send({
                success: false,
                message: error.message
            });
        }
    }

    public static async create(request: NextApiRequest, response: NextApiResponse<any>) {
        const data = request.body

        const rules = {
            name: {
                label: "Name",
                rules: "required|alpha",
            },
            email: {
                label: "E-mail",
                rules: "required|email",
            },
            password: {
                label: "Password",
                rules: "required|min:8|max:20"
            }
        }

        const validator = Validozer.make(data, rules)

        if(validator.fails()) {
            const errors = validator.errorsJSON()

            return response.status(200).send({
                success: false,
                errors
            })
        }

        const connectionPool = new ConnectionPool()

        try {
            await connectionPool.open()

            const user = new User()
            user.name = data.name
            user.email = data.email
            user.password = data.password
            
            await user.save()

            const userRole = await user.roles().findOrNew(1)

            await userRole.save()

            return response.status(201).send({
                success: true,
                id: user.id,
                message: `User created successfully`
            })
        } catch (error) {
            
            return response.status(500).send({
                success: false,
                message: error.message
            })
        } finally {

            await connectionPool.close()

        }
    }

    public static async update(request: NextApiRequest, response: NextApiResponse<any>) {
        const { id } = request.query as Record<string, string>

        const data = request.body

        const rules = {
            name: {
                label: "Name",
                rules: "required|alpha",
            },
            password: {
                label: "Password",
                rules: "required|min:8|max:20"
            }
        }

        const validator = Validozer.make(data, rules)

        if(validator.fails()) {

            const errors = validator.errorsJSON()

            return response.status(200).send({
                success: false,
                errors
            })
        }

        const connectionPool = new ConnectionPool()

        try {
            await connectionPool.open()

            const user = await User.find(id)

            if(!user.hasItem) {
                return response.status(404).send({
                    success: false,
                    message: `User Not Found`
                });
            }

            user.name = data.name
            user.password = data.password

            await user.save()

            const userRole = await user.roles().findOrNew(3)

            await userRole.save()

            return response.status(200).send({
                success: true,
                id: user.id,
                message: `User updated successfully`
            })
        } catch (error) {
            
            return response.status(500).send({
                success: false,
                message: error.message
            })
        } finally {

            connectionPool.close()

        }
    }


    public static async destroy(request: NextApiRequest, response: NextApiResponse<any>) {
        const { id } = request.query as Record<string, string>

        const connectionPool = new ConnectionPool()

        try {
            await connectionPool.open()
            await User.findAndDelete(id, ['activities', 'roles'])

            return response.status(200).send({
                success: true,
                message: `User deleted successfully`
            })

        } catch (error) {
            
            return response.status(500).send({
                success: false,
                message: error.message
            })

        } finally {

            connectionPool.close()
            
        }
    }

}

export default UserController
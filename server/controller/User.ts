import User from "@model/User"
import { ConnectionPool } from "eloquents"
import { NextApiRequest, NextApiResponse } from "next"
import Validozer from "validozer/esm"
import BaseController from "./BaseController"
import { compare, hash } from 'bcryptjs'
import { getSession } from "next-auth/react"

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
                
            return response.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            
            return response.status(500).json({
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
                response.status(200).json({
                    success: false,
                    message: `User Not Found`
                })
            }

            response.status(200).json({
                success: true,
                data: user.toJSON(),
            })

        } catch (error) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
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

            return response.status(200).json({
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

            return response.status(201).json({
                success: true,
                id: user.id,
                message: `User created successfully`
            })
        } catch (error) {
            
            return response.status(500).json({
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

            return response.status(200).json({
                success: false,
                errors
            })
        }

        const connectionPool = new ConnectionPool()

        try {
            await connectionPool.open()

            const user = await User.find(id)

            if(!user.hasItem) {
                return response.status(404).json({
                    success: false,
                    message: `User Not Found`
                });
            }

            user.name = data.name
            user.password = data.password

            await user.save()

            const userRole = await user.roles().findOrNew(3)

            await userRole.save()

            return response.status(200).json({
                success: true,
                id: user.id,
                message: `User updated successfully`
            })
        } catch (error) {
            
            return response.status(500).json({
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
            await User.findAndDelete(id, ['activities', 'roles', 'providers'])

            return response.status(200).json({
                success: true,
                message: `User deleted successfully`
            })

        } catch (error) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })

        } finally {

            connectionPool.close()
            
        }
    }

    public static async registration(request: NextApiRequest, response: NextApiResponse<any>) {

        const data = request.body
        const rules = {
            name: {
                label: "Name",
                rules: "required",
            },
            email: {
                label: "E-mail",
                rules: "required|email",
            },
            password: {
                label: "Password",
                rules: "required|min:8|max:20"
            },
            confirm: {
                label: "Comfirm Password",
                rules: "required|same:password@Password"
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

            const exist = await User.where('email', data.email).first()

            if(exist.hasItem) {
                return response.status(200).send({
                    success: false,
                    errors:[{
                        field: 'email',
                        message: "E-mail was already taken"
                    }]
                })
            }

            const user = new User()
            user.name = data.name
            user.email = data.email
            user.password = await hash(data.password, 12)
            await user.save()

            // role 3 is consumer
            const newRole = await user.roles().findOrNew(3)
            await newRole.save()

            return response.status(201).send({
                success: true,
                id: user.id,
                message: `User registered successfully`
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

    public static async changePassword(request: NextApiRequest, response: NextApiResponse<any>) {
        const data = request.body
        const rules = {
            current: {
                label: "Current Password",
                rules: "required|min:8|max:20"
            },
            password: {
                label: "Password",
                rules: "required|min:8|max:20"
            },
            confirm: {
                label: "Comfirm Password",
                rules: "required|same:password@Password"
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

            const session = await getSession({ req: request })

            const user = await User.find(session?.user.id!)

            if(!user.hasItem) {

                return response.status(200).send({
                    success: false,
                    message: "User don't exist"
                })

            }

            const valid = await compare(data.password, user.password!)

            if(!valid) {

                return response.status(200).send({
                    success: false,
                    errors: [{
                        field: 'current',
                        message: "Current Password was incorrect"
                    }]
                })
                
            }

            user.password = await hash(data.password, 12)

            await user.save()

            return response.status(200).send({
                success: true,
                message: 'User change password successfully'
            })
        } catch(error) {
            return response.status(500).send({
                success: false,
                message: error.message
            });
        } finally {

            await connectionPool.close()
        }
    }

}

export default UserController
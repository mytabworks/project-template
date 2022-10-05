import { NextApiResponse } from "next";
import BaseController from "./BaseController";
import nodemailer from "nodemailer"
import webpush from "web-push"
import { NextApiRequestWithSession } from "@server/session";
import User from "@server/model/User";
import { ConnectionPool } from "eloquent.orm.js";
import UserWebPushSubscription from "@server/model/UserWebPushSubscription";
import notifyUsers from "@server/utils/notifyUsers";
import Chat from "@server/model/Chat";
import ChatMessage from "@server/model/ChatMessage";
import { SocketEvent } from "@server/socket";

class FeaturesController extends BaseController {

    public static async generateVAPIDkeys(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        try {

            response.status(200).json({
                success: true,
                data: webpush.generateVAPIDKeys(),
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    public static async webpush(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        const cp = new ConnectionPool()

        try {
            const body = request.body
            const session = request.session
            await cp.open()

            await notifyUsers([1, 2, 3, 4, 5, 6], {
                "title": `${session?.user.name} Message`, 
                "options": {
                    "icon": "http://localhost:3000/vercel.svg",
                    "silent": false ,
                    "body": "This web app is being served cache-first by a service worker. To learn more, visit"
                }
            }, cp)

            response.status(200).json({
                success: true,
                message: "send successfully"
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        } finally {

            await cp.close()
        }
    }

    public static async subscribe(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        const cp = new ConnectionPool()
        try {

            await cp.open()

            const body = request.body
            const session = request.session

            const user = await User.find(session?.user.id!, ["id"], cp)

            if(user.exists === false) {
                return response.status(200).json({
                    success: false,
                    message: "User doesn't exist"
                })
            }

            const subs = user.webPushSubscriptions().create()

            subs.endpoint = body.endpoint
            subs.expiration_time = body.expirationTime
            subs.key_auth = body.keys.auth
            subs.key_p256dh = body.keys.p256dh

            await subs.save(cp)


            response.status(200).json({
                success: true,
                message: "Subscribe Push Notification successfully",
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        } finally {

            await cp.close()
        }
    }

    public static async unsubscribe(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        try {
            const body = request.body
            const session = request.session

            const subs = await UserWebPushSubscription
                .where('user_id', session?.user.id!)
                .where('endpoint', body.endpoint)
                .where('key_auth', body.keys.auth)
                .where('key_p256dh', body.keys.p256dh)
                .first()

            if(subs.exists === true) {
                await subs.delete()
            }

            return response.status(200).json({
                success: true,
                message: "Unsubscribe Push Notification successfully",
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    public static async savesocket(request: NextApiRequestWithSession, response: NextApiResponse<any>) {

        const cp = new ConnectionPool()

        try {

            await cp.open()

            const session = request.session

            const { socket_id } = request.body

            const user = await User.find(session?.user.id!, ["id", "socket_id"], cp)

            user.socket_id = socket_id

            await user.save(cp)
            
            response.status(200).json({
                success: true
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        } finally {

            await cp.close()
        }
    }

    public static async createchat(request: NextApiRequestWithSession, response: NextApiResponse<any>) {

        const cp = new ConnectionPool()

        try {

            await cp.open()

            const session = request.session

            const { user_id } = request.body

            const user = await User.find(session?.user.id!, ["*"], cp)

            const chat = await user.getChat(user_id)
            // checking if user is already a friend
            if(chat.hasItem === false) {

                const connectWithUser = await User.find(user_id, ["*"], cp)
    
                const chat = new Chat()
    
                chat.title = connectWithUser.name || ''
    
                chat.grouped = false
    
                await chat.save(cp)
    
                const userChat = await user.chats().pool(cp).findOrNew(chat.id!)
    
                await userChat.save(cp)
    
                const userChatWith = await connectWithUser.chats().pool(cp).findOrNew(chat.id!)
    
                await userChatWith.save(cp)

                return response.status(200).json({
                    success: true,
                    item: {
                        ...chat.toJSON(),
                        users: [connectWithUser]
                    }
                })
            }

            response.status(200).json({
                success: true,
                item: chat
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        } finally {

            await cp.close()
        }
    }

    public static async chats(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        const cp = new ConnectionPool()

        try {

            await cp.open()

            const session = request.session

            const user = await User.find(session?.user.id!, ['*'], {
                'chats': (query) => {
                    query.orderBy('updated_at', 'DESC')
                },
                'chats.users': (query) => {
                    query.where('id', '!=', session?.user.id!)
                },
                'chats.messages': (query) => {
                    query.select('id', 'chat_id').where('seen', false).where('user_id', '!=', session?.user.id!)
                },
            }, cp)
            
            response.status(200).json({
                success: true,
                items: user.$chats?.toJSON()
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        } finally {

            await cp.close()
        }
    }

    public static async getmessages(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        const cp = new ConnectionPool()

        try {

            await cp.open()

            const session = request.session

            const params = request.query

            const page = parseInt(params.page as string || '1')
            const size = parseInt(params.size as string || '10')

            const messages = await ChatMessage
            .where('chat_id', params.chat_id)
            .orderBy('created_at', 'DESC')
            .with('attachments')
            .pool(cp)
            .paginate(page, size)

            await (ChatMessage
                .where('seen', false)
                .where('user_id', '!=', session?.user.id)
                .where('chat_id', params.chat_id) as any)
                .update({ seen: true })

            response.status(200).json({
                success: true,
                items: messages,
                totalCount: messages.totalCount(),
                next: Math.ceil(messages.totalCount()/size) >= page
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        } finally {

            await cp.close()
        }
    }

    public static async seenmessages(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        const cp = new ConnectionPool()

        try {

            await cp.open()

            const session = request.session

            const params = request.query

            await (ChatMessage
                .where('seen', false)
                .where('user_id', '!=', session?.user.id)
                .where('chat_id', params.chat_id) as any)
                .update({ seen: true })

            response.status(200).json({
                success: true
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        } finally {

            await cp.close()
        }
    }

    public static async sendmessage(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        const session = request.session
        const socket = request.socket.server.io
        const {chat_id, message, attachments} = request.body
        const sender = session?.user
        
        const cp = new ConnectionPool()

        try {
            await cp.open()
            
            const chat = await Chat.find(chat_id, ["*"], cp)

            if(!chat.exists) {
                return response.status(400).json({
                    success: false,
                    message: `chat_id \`${chat_id}\` does not exist`
                })
            }

            const sendToUsers = await chat.users().pool(cp).where('id', '!=', session?.user.id).get()

            chat.updated_at = new Date().toISOString()
            
            await chat.save(cp)
            
            const chatMessage = chat.messages().create()

            chatMessage.user_id = session?.user.id
            chatMessage.description = message
            
            await chatMessage.save(cp)

            const payload: SocketEvent = {
                type: "chat.message",
                data: {
                    chat: { id: chat.id, title: chat.title },
                    sender: { id: sender?.id, name: sender?.name, profile_img: sender?.profile_img },
                    message: chatMessage.toJSON(),
                }
            }

            for(let user of sendToUsers) {
                if(user.socket_id) {

                    socket.to(user.socket_id).emit("socket.client", payload)
                }
            }

            const notInteractingUsers = sendToUsers
                .filter((user) => user.interacting === false && user.active === true)
                .map(user => user.id!)

            if(notInteractingUsers.length > 0) {
                await notifyUsers(notInteractingUsers, {
                    "title": `${sender?.name} on ${chat.title}`, 
                    "options": {
                        "icon": "http://localhost:3000/vercel.svg",
                        "silent": false ,
                        "body": message
                    }
                }, cp)
            }

            response.status(201).json({
                success: true,
                id: chatMessage.id,
                item: payload.data.message
            })

        } catch (error: any) {

            throw new Error(error.message)
        } finally {

            await cp.close()
        }
    }

    public static async nodemailer(request: NextApiRequestWithSession, response: NextApiResponse<any>) {
        try {
            const session = request.session

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "myproxyemailserver@gmail.com",
                    pass: "xxxxxxx"
                }
            })

            const trans = await transporter.sendMail({
                from: '"Boooo 👻" <foo@example.com>', // sender address
                to: session?.user.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });

            response.status(200).json({
                success: true,
                data: trans,
            })

        } catch (error: any) {
            
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

export default FeaturesController
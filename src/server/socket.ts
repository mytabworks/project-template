import { ConnectionPool } from "eloquent.orm.js";
import { NextApiRequest, NextApiResponse } from "next"
import { Server, Socket as SocketIO } from "socket.io"
import User from "./model/User";
import Chat from "./model/Chat";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type NextApiRequestWithSocket = NextApiRequest & {
    socket: Socket & {
        server?: DefaultEventsMap
    }
}

export type SocketEvent<D = Record<string, any>> = {
    type: 'chat.message' | 'chat.typing' | 'notification' | 'disconnected';
    data: D;
}

export type SocketEventChatMessage = {
    user_id: number;
    chat_id: number;
    message: string; 
    attachments?: any;
}

class Socket {
    
    public static connected: boolean = false

    public static createIfNotExists(request: NextApiRequestWithSocket, _response: NextApiResponse) {
        
        if(this.connected === false) {
            
            const io = new Server(request.socket.server, {
                path: '/socket'
            });

            (request.socket.server as any).io = io;
            
            this.initialize(io)
            
            this.connected = true

        }
    }

    private static initialize(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {

        io.on("connection", (socket) => {
            
            socket.on("socket.server", (event: SocketEvent<any>) => {
                switch (event.type) {
                    case "chat.message":

                        this.chatmessage(socket, event)
                        
                        break;
                
                    default:
                        break;
                }
            })
        })
    
        console.log("Socket is initialized");
    }

    private static async chatmessage(socket: SocketIO<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, event: SocketEvent<SocketEventChatMessage>) {

        const {user_id, chat_id, message, attachments} = event.data

        const cp = new ConnectionPool()

        try {
            await cp.open()
            
            const chat = await Chat.find(chat_id, ["*"], {
                users: (query) => {
                    query.where('user.id', '!=', user_id)
                }
            }, cp)

            const chatMessage = chat.messages().create()

            chatMessage.user_id = user_id
            chatMessage.description = message
            
            await chatMessage.save(cp)

            const payload: SocketEvent = {
                type: "chat.message",
                data: chatMessage.toJSON()
            }

            for(let user of chat.$users!) {

                if(user.socket_id) {

                    socket.to(user.socket_id).emit("socket.client", payload)
                }
            }

        } catch (error: any) {

            throw new Error(error.message)
        } finally {

            await cp.close()
        }
    }

    

}

export default Socket
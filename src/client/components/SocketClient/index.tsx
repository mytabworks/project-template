import type { SocketEvent, SocketEventChatMessage } from '@server/socket'
import { useAPI } from '@client/common/hooks/useAPI'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import worldTrigger from 'world-trigger'
import retoast from 'retoast'
import chatmessages from './chatmessage'

const getBaseUrl = () => {
    if (typeof window !== "undefined") return window.location.origin; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

interface SocketClientProps {
    children: React.ReactNode;
}

const SocketClient: React.FunctionComponent<SocketClientProps> = ({children}) => {
    const { data, status } = useSession()

    const requestSaveSocket = useAPI('/api/feature/chat/savesocket', { method: "PUT" })

    useEffect(() => {
        if(status === "authenticated" && data.user.id) {

            const socket = io(getBaseUrl(), { path: '/socket' })
            
            socket.on("connect", () => {
                console.log("SOCKET CONNECTED!", socket.id);
                requestSaveSocket.call({
                    data: {
                        socket_id: socket.id
                    }
                })
            })

            socket.on("error", (event) => {
                alert(JSON.stringify(event))
            })
    
            socket.on("socket.client", (event: SocketEvent) => {
                
                switch (event.type) {
                    case "chat.message":
                        chatmessages(event.data as any)
                        break;
                
                    default:
                        break;
                }
            })

            const handle = (event: SocketEvent) => {
                socket.emit("socket.server", event)
            }
            
            worldTrigger.addTrigger("socket.server", handle)

            return () => {
                socket.off("connect")
                socket.off("error")
                socket.off("socket.client")
                worldTrigger.removeTrigger("socket.server", handle)
                socket.close()
            }
        }
        
    }, [data])

    return (
        <>
            {children}
        </>
    )
}

export default SocketClient

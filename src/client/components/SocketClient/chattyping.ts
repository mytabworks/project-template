import worldTrigger from 'world-trigger'
import type { SocketEventChatTyping } from '@server/socket'

export default function chattyping(data: SocketEventChatTyping) {
    worldTrigger.dispatchTrigger(`socket.client.chat.typing`, data)
}
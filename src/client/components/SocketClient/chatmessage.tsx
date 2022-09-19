import React from 'react'
import worldTrigger from 'world-trigger'
import retoast from 'retoast'

type SocketEventChatMessage = {
    sender: {
        id: number;
        name: string;
        profile_img: string;
    };
    chat: {
        id: number;
        title: string;
    };
    message: {
        id: number;
        user_id: number;
        chat_id: number;
        description: string;
        updated_at: string;
        created_at: string;
    };
}

export default function chatmessages(data: SocketEventChatMessage) {
    worldTrigger.dispatchTrigger(`socket.client.active.chat.message.${data.message.chat_id}`, data.message)
    worldTrigger.dispatchTrigger('socket.client.chat.update', data.message)
    retoast({
        variant: 'info',
        duration: 0,
        body: (
            <div>
                <small>{data.sender.name}</small>
                <small>{data.message.description}</small>
            </div>
        )
    })
}
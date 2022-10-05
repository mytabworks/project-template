import React from 'react'
import worldTrigger from 'world-trigger'
import toast from 'react-bootstrap-toast'

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
    toast({
        bg: 'info',
        dismissible: true,
        duration: 10000,
        header: (
            <>
                <img src={data.sender.profile_img} className="rounded me-2" style={{width: 20}}/>
                <b className="me-auto">{data.sender.name}</b>
            </>
        ),
        body: data.message.description
    })
}
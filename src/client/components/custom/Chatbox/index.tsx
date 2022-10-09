import { useAPI } from '@client/common/hooks/useAPI'
import { useWorldTrigger } from '@client/common/hooks/useWorldTrigger';
import { uniqueData } from '@client/common/utils/data';
import type { SocketEventChatTyping } from '@server/socket';
import React, { useEffect, useMemo, useState } from 'react'
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import messages from 'src/pages/api/feature/chat/messages';
import ChatRoom from './ChatRoom';
import ChatSearch from './ChatSearch';

type StateProps = {
    active_chat: null | Record<string, any>;
    chats: Record<string, any>[];
    chat_replyings: Record<string, SocketEventChatTyping[]>;
}

interface ChatboxProps {
    
}

const Chatbox: React.FunctionComponent<ChatboxProps> = (props) => {
    const [{
        active_chat, 
        chats,
        chat_replyings
    }, setStates] = useState<StateProps>({
        active_chat: null,
        chats: [],
        chat_replyings: {}
    })
    const requestChats = useAPI('/api/feature/chat', { method: "GET" })

    useEffect(() => {
        requestChats.call().then((response) => {

            const chats = response.data.items

            let active_chat = chats[0]

            if(chats.length > 0) {

                active_chat = {...active_chat, messages: []}
            }

            setStates(prev => ({...prev, chats, active_chat: active_chat || null}))
        })
    }, [])

    useWorldTrigger('chat.refetch', (chat_data) => {
        requestChats.call().then(() => {
            setStates(prev => ({...prev, active_chat: chat_data}))
        })
    }, [])

    useWorldTrigger('socket.client.chat.update', (message) => {
        setStates(prev => {
            let update_chats: Record<string, any>[] = prev.chats
            
            const find_chat = prev.chats.find(chat => chat.id === message.chat_id)

            if(find_chat) {
                update_chats = [
                    {
                        ...find_chat, 
                        messages: [...find_chat.messages, {id: message.id, chat_id: message.chat_id}] 
                    }, 
                    ...update_chats.filter((chat) => chat.id !== message.chat_id)
                ]
            } else {

            }

            return {...prev, chats: update_chats }
        })
    }, [])

    // user is typing
    useWorldTrigger(`socket.client.chat.typing`, (data: SocketEventChatTyping) => {
        
        setStates(prev => {

            const update_chat_replyings = {...prev.chat_replyings}

            if(update_chat_replyings[data.chat_id]) {

                const update_replys = uniqueData('user_id', prev.chat_replyings[data.chat_id]).filter((each) => each.user_id === data.user_id && data.typing === true)

                update_chat_replyings[data.chat_id] = data.typing === true ? [...update_replys, data] : update_replys

            } else {
                update_chat_replyings[data.chat_id] = [data]
            }

            return {
                ...prev,
                chat_replyings: update_chat_replyings
            }
        })
    }, [])

    const handleChatSeen = (chat: Record<string, any>) => {
        setStates(prev => {
            const update_chats = prev.chats.filter(each => each.id !== chat.id)

            const update_active_chat = {...chat, messages: []}

            return {...prev, active_chat: update_active_chat, chats: [...update_chats, update_active_chat]}
        })
    }

    useWorldTrigger('chat.message.seen', handleChatSeen, [])

    return (
        <div className="chat-box">
            <div className="chat-box-users">
                <div className="d-flex justify-content-end">
                    <ChatSearch/>
                </div>
                <ListGroup as="ul">
                    {chats?.map((chat: any) => {
                        const unseenMessages = chat.messages?.length
                        return (
                            <ListGroup.Item
                                key={chat.id}
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <a href={`#${chat.id}`} className="fw-bold" onClick={() => handleChatSeen(chat)}>{chat.users[0]?.name}</a>
                                {unseenMessages > 0 && (
                                    <Badge bg="primary" pill>
                                        {unseenMessages}
                                    </Badge>
                                )}
                                {(chat_replyings[active_chat?.id] || []).length > 0 && "⋯"}
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </div>
            <ChatRoom chat={active_chat} userReplyings={chat_replyings[active_chat?.id]}/>
        </div>
    )
}

export default Chatbox

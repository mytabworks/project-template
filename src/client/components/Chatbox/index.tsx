import { useAPI } from '@client/common/hooks/useAPI'
import { useWorldTrigger } from '@client/common/hooks/useWorldTrigger';
import React, { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import messages from 'src/pages/api/feature/chat/messages';
import ChatRoom from './ChatRoom';
import style from './index.module.scss'
import SearchChat from './SearchChat';

type StateProps = {
    active_chat: null | Record<string, any>;
    chats: Record<string, any>[];
}

interface ChatboxProps {
    
}

const Chatbox: React.FunctionComponent<ChatboxProps> = (props) => {
    const [{active_chat, chats}, setStates] = useState<StateProps>({
        active_chat: null,
        chats: [] 
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

    return (
        <div className={style['chat-box']}>
            <div className={style['chat-box-users']}>
                <div className="d-flex justify-content-end">
                    <SearchChat/>
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
                                <a href={`#${chat.id}`} className="fw-bold" onClick={() => {

                                    setStates(prev => {
                                        const update_chats = prev.chats.filter(each => each.id !== chat.id)

                                        const update_active_chat = {...chat, messages: []}

                                        return {...prev, active_chat: update_active_chat, chats: [...update_chats, update_active_chat]}
                                    })
                                }}>{chat.users[0]?.name}</a>
                                {unseenMessages > 0 && (
                                    <Badge bg="primary" pill>
                                        {unseenMessages}
                                    </Badge>
                                )}
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </div>
            <ChatRoom chat={active_chat}/>
        </div>
    )
}

export default Chatbox

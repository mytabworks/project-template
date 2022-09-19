import React, { useEffect, useRef, useState } from 'react'
import style from '../index.module.scss'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { FormEvent, useForm } from 'formydable'
import { useAPI } from '@client/common/hooks/useAPI'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import worldTrigger from 'world-trigger'
import type { SocketEvent, SocketEventChatMessage } from '@server/socket'
import { useWorldTrigger } from '@client/common/hooks/useWorldTrigger'

interface ChatRoomProps {
    chat?: Record<string, any> | null;
}

const ChatRoom: React.FunctionComponent<ChatRoomProps> = ({chat}) => {
    const { data } = useSession()
    const requestMessages = useAPI('/api/feature/chat/messages', { method: "GET" })
    const requestSendMessages = useAPI('/api/feature/chat/sendmessage', { method: "POST" })
    const chatBodyRef = useRef<HTMLDivElement>(null)
    const formMethods = useForm({ message: {
        label: 'Message'
    }})

    const [{messages}, setStates] = useState<{messages: Record<string, any>[]}>({
        messages: []
    })

    const message = formMethods.formState('message')

    const handleSubmit = formMethods.formSubmit((event: FormEvent) => {
        const FORM_DATA = event.json()
        event.resetForm()

        const temp_id = Math.random().toString()

        const payload = {
            chat_id: chat?.id, 
            message: FORM_DATA.message
        }

        setStates(prev => ({
            ...prev, 
            messages: [
                ...prev.messages, 
                {
                    chat_id: payload.chat_id,
                    description: payload.message,
                    temp_id, 
                    user_id: data?.user.id
                }
            ]
        }))

        requestSendMessages.call({
            data: {
                chat_id: chat?.id, 
                message: FORM_DATA.message
            }
        })
        .then((response) => {
            if(response.data.success) {
                setStates(prev => ({
                    ...prev,
                    messages: prev.messages.map((message) => 
                        message.temp_id === temp_id ? {
                            ...response.data.item, 
                            temp_id
                        } : message
                    )
                }))
            }
        })
        // worldTrigger?.dispatchTrigger('socket.server', payload)
    })

    useEffect(() => {
        if(chat?.id) {
            requestMessages.call({
                params: {
                    chat_id: chat?.id,
                    page: 1
                }
            })
            .then((response) => {
                if(response.data.success) {
                    response.data.items.reverse()
                    setStates(prev => ({...prev, messages: [...response.data.items]}))
                }
            })
        }
    }, [chat])

    useEffect(() => {
        const chatBody = chatBodyRef.current

        if(chatBody)
            chatBody.scrollTop = chatBody.scrollHeight - chatBody.clientHeight
    }, [messages])

    useWorldTrigger(`socket.client.active.chat.message.${chat?.id}`, (message: Record<string, any>) => {
        setStates(prev => ({...prev, messages: [...prev.messages, message]}))
    }, [chat?.id])

    return (
        <div className={style['chat-box-convo']}>
            <div className={style['chat-box-convo-header']}>
                <div className="fw-bold">{chat?.users[0]?.name}</div>
            </div>
            <div ref={chatBodyRef} className={style['chat-box-convo-body']}>
                {messages.map((item: any) => {
                    return (
                        <div key={item.temp_id || item.id} className={classNames(style['chat-box-convo-message-block'], { [style['chat-box-convo-message-me']]: item.user_id === data?.user.id })}>
                            <div className={style['chat-box-convo-message']}>
                                {item.description}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={style['chat-box-convo-footer']}>
                <form onSubmit={handleSubmit}>
                    <InputGroup className={`mb-3 h-100 ${style['input-group']}`}>
                        <Form.Control
                            placeholder="Message..."
                            aria-label="Message..."
                            aria-describedby="basic-addon2"
                            name="message"
                            value={message.value}
                            onChange={formMethods.formUpdate}
                        />
                        <Button type="submit" variant="outline-secondary" id="button-addon2">
                            SEND
                        </Button>
                    </InputGroup>
                </form>
            </div>
        </div>
    )
}

export default ChatRoom

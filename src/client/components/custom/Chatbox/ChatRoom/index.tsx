import React, { useEffect, useRef, useState } from 'react'
import { Badge, Button, Form, InputGroup } from 'react-bootstrap'
import { FormEvent, useForm } from 'formydable'
import { useAPI } from '@client/common/hooks/useAPI'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import worldTrigger from 'world-trigger'
import type { SocketEvent, SocketEventChatTyping } from '@server/socket'
import { useWorldTrigger } from '@client/common/hooks/useWorldTrigger'
import Loader from '@client/components/Loader'
import Icon from '@client/components/Icon'
import { emptyArray } from '@client/common/utils/assets'

const useTypingBroadcast = ({chat_id, user_id, user_name}: Omit<SocketEventChatTyping, 'typing'>) => {
    const observable = useRef<{
        typing: boolean;
        cleanup: any;
    }>({
        typing: false,
        cleanup: null
    }).current

    useEffect(() => {
        return () => clearTimeout(observable.cleanup)
    }, [])

    const handleEndTyping = () => {

        observable.typing = false

        worldTrigger.dispatchTrigger<SocketEvent<SocketEventChatTyping>>('socket.server', {
            type: 'chat.typing',
            data: {
                typing: false,
                chat_id,
                user_id,
                user_name
            }
        })
        
    }

    return {
        active: () => {
        
            if(observable.typing === false) {

                observable.typing = true

                worldTrigger.dispatchTrigger<SocketEvent<SocketEventChatTyping>>('socket.server', {
                    type: 'chat.typing',
                    data: {
                        typing: true,
                        chat_id,
                        user_id,
                        user_name
                    }
                })
            }
    
            clearTimeout(observable.cleanup)
    
            observable.cleanup = setTimeout(handleEndTyping, 5000)
        },
        end: () => {
            clearTimeout(observable.cleanup)

            handleEndTyping()
        }
    }
}

type StateProps = {
    messages: Record<string, any>[], 
    autoscroll: boolean
}

interface ChatRoomProps {
    chat?: Record<string, any> | null;
    userReplyings?: SocketEventChatTyping[]
}

const ChatRoom: React.FunctionComponent<ChatRoomProps> = ({chat, userReplyings}) => {
    const { data } = useSession()
    const requestMessages = useAPI('/api/feature/chat/messages', { method: "GET" })
    const requestSendMessages = useAPI('/api/feature/chat/sendmessage', { method: "POST" })
    const chatBodyRef = useRef<HTMLDivElement>(null)
    const formMethods = useForm({ message: {
        label: 'Message'
    }})

    const typing = useTypingBroadcast({ chat_id: chat?.id, user_id: data?.user.id!, user_name: data?.user.name})

    const [{messages, autoscroll}, setStates] = useState<StateProps>({
        messages: [],
        autoscroll: false
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

        typing.end()

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

    // get initial message
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
    }, [chat?.id])

    // auto scroll down when user send a new message
    useEffect(() => {
        const chatBody = chatBodyRef.current

        if(chatBody && autoscroll)
            chatBody.scrollTo({
                left: 0,
                top: chatBody.scrollHeight - chatBody.clientHeight,
                behavior: 'smooth'
            })
    }, [messages])

    // receive new message
    useWorldTrigger(`socket.client.active.chat.message.${chat?.id}`, (message: Record<string, any>) => {
        const chatBody = chatBodyRef.current

        setStates(prev => ({...prev, messages: [...prev.messages, message], autoscroll: ((chatBody?.scrollHeight || 0) - (chatBody?.clientHeight || 0)) === chatBody?.scrollTop}))
    }, [chat?.id])

    // check new message is seen
    useEffect(()=> {
        
        const lastmessage = messages[messages.length - 1]
        
        if(lastmessage && lastmessage.user_id !== data?.user.id && lastmessage.seen === false) {
            let dispatchOnce = false
            const lastmessagenode = document.getElementById('chat-message-' + lastmessage.id)!
            let observer = new IntersectionObserver(([entry]) => {
                if(entry.isIntersecting && dispatchOnce === false) {
                    dispatchOnce = true
                    observer.unobserve(lastmessagenode)
                    worldTrigger.dispatchTrigger('chat.message.seen', chat)
                }
            }, {
                threshold: 0.1,
            })

            observer.observe(lastmessagenode)
            
            return () => observer.disconnect()
        }

        
    }, [messages, chat?.id])

    return (
        <div className='chat-box-convo'>
            <div className='chat-box-convo-header'>
                <div className="fw-bold">{chat?.users[0]?.name}</div>
            </div>
            <div ref={chatBodyRef} className='chat-box-convo-body'>
                {messages.map((item: any) => {
                    return (
                        <div key={item.temp_id || item.id} id={'chat-message-' + item.id} className={classNames('chat-box-convo-message-block', { 'chat-box-convo-message-me': item.user_id === data?.user.id })}>
                            <div className='chat-box-convo-message'>
                                {item.description}
                            </div>
                            {item.user_id === data?.user.id && (
                                <div className="chat-box-convo-message-status"><Icon name="check-circle" /></div>
                            )}
                        </div>
                    )
                })}
                <Loader active={requestMessages.loading} position="top" />
            </div>
            <div className='chat-box-convo-footer'>
                <form onSubmit={handleSubmit}>
                    <InputGroup className={`h-100 input-group`}>
                        <Form.Control
                            placeholder="Message..."
                            aria-label="Message..."
                            aria-describedby="basic-addon2"
                            name="message"
                            value={message.value}
                            onChange={(event) => {
                                typing.active()
                                formMethods.formUpdate(event)
                            }}
                        />
                        <Button type="submit" variant="outline-secondary" id="button-addon2">
                            SEND
                        </Button>
                    </InputGroup>
                </form>
                {(userReplyings || emptyArray).length > 0 && (
                    <Badge bg="secondary">{userReplyings?.map((data, index) => {
                        const count = userReplyings?.length
                        const isLast = index === (count - 1)
                        return `${count > 1 && isLast ? 'and ' : ''}${data.user_name} typing...`
                    }).join(', ')}</Badge>
                )}
            </div>
        </div>
    )
}

export default ChatRoom

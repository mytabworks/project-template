import { useAPI } from '@client/common/hooks/useAPI'
import { useEffectMounted } from '@client/common/hooks/useEffectMounted'
import React, { useEffect, useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { dispatchTrigger } from 'world-trigger/esm'
import Toggle from './Toggle'

interface ChatSearchProps {
    
}

const ChatSearch: React.FunctionComponent<ChatSearchProps> = (props) => {
    const [search, setSearch] = useState<string>('')
    const request = useAPI('/api/user', { method: "GET" })
    const requestCreateChat = useAPI('/api/feature/chat/create')

    useEffect(() => {
        request.call({
            params: { search }
        })
    }, [])

    useEffectMounted(() => {
        const cleanup = setTimeout(() => {
            request.call({
                params: { search }
            })
        }, 1000)

        return () => clearTimeout(cleanup)
    }, [search])

    return (
        <Dropdown>
            <Dropdown.Toggle as={Toggle} id="dropdown-custom-components">
                + add chat
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
                {request.response?.items.map((user: any) => {
                    return (
                        <Dropdown.Item key={user.id} eventKey={user.id} onClick={() => {
                            requestCreateChat.call({data: {user_id: user.id}}).then((response) => {
                                dispatchTrigger('chat.refetch', response.data.item)
                            })  
                        }}>{user.name}</Dropdown.Item>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ChatSearch

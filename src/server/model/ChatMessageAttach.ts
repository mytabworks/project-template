import { Model, ModelWrapper, ModelEntity } from 'eloquent.orm.js'
import { ChatMessageAttachEntity } from '../entity/ChatMessageAttach'
import ChatMessage from './ChatMessage'

@ModelEntity(ChatMessageAttachEntity, 'chat_message_attach')
class ChatMessageAttach extends Model {

    protected use = "table"

    protected fillable = [
        'file_url',
        'chat_message_id'
    ]

    public chatMessage() {
        return this.belongsTo(ChatMessage)
    }
}

export default ModelWrapper(ChatMessageAttach, ChatMessageAttachEntity)
import { Model, ModelWrapper, ModelEntity } from 'eloquent.orm.js'
import { ChatMessageEntity } from '../entity/ChatMessage'
import Chat from './Chat'
import ChatMessageAttach from './ChatMessageAttach'
import User from './User'

@ModelEntity(ChatMessageEntity, 'chat_message')
class ChatMessage extends Model {

    protected use = "table"

    protected fillable = [
        'chat_id',
        'user_id',
        'description',
    ]

    protected updatable = [
        'description',
        'seen'
    ]

    public chat() {
        return this.belongsTo(Chat)
    }

    public user() {
        return this.belongsTo(User)
    }

    public attachments() {
        return this.hasMany(ChatMessageAttach, 'chat_message_id')
    }
}

export default ModelWrapper(ChatMessage, ChatMessageEntity)
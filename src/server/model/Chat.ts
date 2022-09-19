import { Model, ModelWrapper, ModelEntity } from 'eloquent.orm.js'
import { ChatEntity } from '../entity/Chat'
import ChatMessage from './ChatMessage'
import User from './User'
import UserChat from './UserChat'

@ModelEntity(ChatEntity, 'chat')
class Chat extends Model {

    protected use = "table"

    protected fillable = [
        'title',
        'grouped',
    ]

    protected updatable = [
        'title',
        'updated_at'
    ]

    public users() {
        return this.belongsToMany(User, UserChat)
    }

    public messages() {
        return this.hasMany(ChatMessage)
    }
}

export default ModelWrapper(Chat, ChatEntity)
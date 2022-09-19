import { Model, ModelWrapper, ModelEntity } from 'eloquent.orm.js'
import { UserChatEntity } from '../entity/UserChat'

@ModelEntity(UserChatEntity, 'user_chat')
class UserChat extends Model {
    
    protected use = "table"

    protected fillable = [
        'user_id',
        'chat_id'
    ]
}

export default ModelWrapper(UserChat, UserChatEntity)
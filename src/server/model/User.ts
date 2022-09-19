import { Model, ModelWrapper, ModelEntity, ConnectionPool } from 'eloquent.orm.js'
import { UserEntity } from '../entity/User'
import Activity from './Activity'
import Role from './Role'
import UserRole from './UserRole'
import UserProvider from './UserProvider'
import UserWebPushSubscription from './UserWebPushSubscription'
import Chat from './Chat'
import UserChat from './UserChat'

@ModelEntity(UserEntity, 'user')
class User extends Model {

    protected use = "table"

    protected fillable = [
        'email',
        'name',
        'password',
        'profile_img',
        'email_verified'
    ]

    protected updatable = [
        'name',
        'password',
        'profile_img',
        'email_verified',
        'active',
        'interacting',
        'last_interaction',
        'socket_id'
    ]

    protected guarded = [
        'password'
    ]

    public activities() {
        return this.hasMany(Activity)
    }

    public webPushSubscriptions() {
        return this.hasMany(UserWebPushSubscription)
    }

    public roles() {
        return this.belongsToMany(Role, UserRole)
    }

    public providers() {
        return this.hasMany(UserProvider)
    }

    public chats() {
        return this.belongsToMany(Chat, UserChat)
    }

    public async getChat(user_id: string | number, cp?: ConnectionPool): ReturnType<typeof Chat["first"]> {

        const query = this.chats().leftJoin('user_chat', 'user_chat.chat_id', 'chat.id')
            .select('(COUNT(user_id) > 0) as friend', 'chat.id as id', 'title', 'grouped', 'chat.updated_at as updated_at', 'chat.created_at as created_at')
            .where('user_chat.user_id', '=', user_id)
            .where('chat.grouped', false)
            .groupBy('chat.id')
            .with({
                users: (query) => {
                    query.where('id', '!=', this.getPrimaryKeyId())
                }
            })

        if(cp) {
            query.pool(cp)
        }

        return query.first()
    }
}

export default ModelWrapper(User, UserEntity)
import { Model, ModelWrapper, ModelEntity } from 'eloquent.orm.js'
import { UserWebPushSubscriptionEntity } from '../entity/UserWebPushSubscription'
import User from './User';

@ModelEntity(UserWebPushSubscriptionEntity, 'user_wp_subscription')
class UserWebPushSubscription extends Model {
    
    protected use = "table"

    protected fillable = [
        'user_id',
        'endpoint',
        'expiration_time',
        'key_auth',
        'key_p256dh'
    ]

    public user() {
        return this.belongsTo(User, 'user_id', 'id')
    }
}

export default ModelWrapper(UserWebPushSubscription, UserWebPushSubscriptionEntity)
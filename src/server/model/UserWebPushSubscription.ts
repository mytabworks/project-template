import { Model, ModelWrapper, ModelEntity } from 'eloquents'
import { UserWebPushSubscription as UserWebPushSubscriptionEntity } from '../entity/UserWebPushSubscription'
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

    protected timestamp: boolean = false;

    public user() {
        return this.belongsTo(User, 'user_id', 'id')
    }
}

export default ModelWrapper(UserWebPushSubscription, UserWebPushSubscriptionEntity)
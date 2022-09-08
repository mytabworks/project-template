import { Model, ModelWrapper, ModelEntity } from 'eloquents'
import { UserProvider as UserProviderEntity } from '@entity/UserProvider'
import User from './User'

@ModelEntity(UserProviderEntity, 'user_provider')
class UserProvider extends Model {

    protected fillable = [
        'type',
        'uid',
        'user_id',
    ]

    public user() {
        return this.belongsTo(User, 'user_id', 'id')
    }
}

export default ModelWrapper(UserProvider, UserProviderEntity)
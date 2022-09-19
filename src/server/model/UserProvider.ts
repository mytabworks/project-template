import { Model, ModelWrapper, ModelEntity } from 'eloquent.orm.js'
import { UserProviderEntity } from '../entity/UserProvider'
import User from './User'

@ModelEntity(UserProviderEntity, 'user_provider')
class UserProvider extends Model {

    protected use = "table"

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
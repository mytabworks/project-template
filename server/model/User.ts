import { Model, ModelWrapper, ModelEntity } from 'eloquents'
import { User as UserEntity } from '@entity/User'
import Activity from './Activity'
import Role from './Role'
import UserRole from './UserRole'

@ModelEntity(UserEntity, 'user')
class User extends Model {

    protected fillable = [
        'email',
        'name',
        'password',
    ]

    protected updatable = [
        'email',
        'name',
        'password',
    ]

    public activities() {
        return this.hasMany(Activity)
    }

    public roles() {
        return this.belongsToMany(Role, UserRole)
    }
}

export default ModelWrapper(User, UserEntity)
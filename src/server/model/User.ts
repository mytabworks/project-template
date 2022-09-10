import { Model, ModelWrapper, ModelEntity } from 'eloquents'
import { User as UserEntity } from '../entity/User'
import Activity from './Activity'
import Role from './Role'
import UserRole from './UserRole'
import UserProvider from './UserProvider'

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
    ]

    protected guarded = [
        'password'
    ]

    public activities() {
        return this.hasMany(Activity)
    }

    public roles() {
        return this.belongsToMany(Role, UserRole)
    }

    public providers() {
        return this.hasMany(UserProvider)
    }
}

export default ModelWrapper(User, UserEntity)
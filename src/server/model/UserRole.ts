import { Model, ModelWrapper, ModelEntity } from 'eloquent.orm.js'
import { UserRoleEntity } from '../entity/UserRole'

@ModelEntity(UserRoleEntity, 'user_role')
class UserRole extends Model {
    
    protected use = "table"

    protected fillable = [
        'user_id',
        'role_id',
    ]
    
}

export default ModelWrapper(UserRole, UserRoleEntity)
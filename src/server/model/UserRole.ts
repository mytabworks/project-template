import { Model, ModelWrapper, ModelEntity } from 'eloquents'
import { UserRole as UserRoleEntity } from '@entity/UserRole'

@ModelEntity(UserRoleEntity, 'user_role')
class UserRole extends Model {
    
    protected use = "table"

    protected fillable = [
        'user_id',
        'role_id',
    ]

    protected timestamp: boolean = false;
}

export default ModelWrapper(UserRole, UserRoleEntity)
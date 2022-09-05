import { Model, ModelWrapper, ModelEntity } from 'eloquents'
import { Role as RoleEntity } from '@entity/Role'

@ModelEntity(RoleEntity, 'role')
class Role extends Model {

    protected deletable: boolean = false;

    protected timestamp: boolean = false;
}

export default ModelWrapper(Role, RoleEntity)
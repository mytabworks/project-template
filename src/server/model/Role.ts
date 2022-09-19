import { Model, ModelWrapper, ModelEntity } from 'eloquent.orm.js'
import { RoleEntity } from '../entity/Role'

export enum RoleType {
    ADMIN = 1,
    MANAGER = 2,
    SUPPORT = 3,
    COORDINATOR = 4,
    SUPPLIER = 5,
    CLIENT = 6
}
@ModelEntity(RoleEntity, 'role')
class Role extends Model {

    protected use = "table"

    protected deletable: boolean = false;

    protected timestamp: boolean = false;
}

export default ModelWrapper(Role, RoleEntity)
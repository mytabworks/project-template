import { Model, ModelWrapper, ModelEntity } from 'eloquents'
import { Activity as ActivityEntity } from '../entity/Activity'
import User from './User'

@ModelEntity(ActivityEntity, 'activity')
class Activity extends Model {

    protected use = "table"

    protected fillable = [
        'user_id',
        'description',
    ]

    protected updatable = [
        'description',
    ]

    public user() {
        return this.belongsTo(User, 'user_id', 'id')
    }
}

export default ModelWrapper(Activity, ActivityEntity)
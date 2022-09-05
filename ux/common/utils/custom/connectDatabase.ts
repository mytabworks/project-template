import { setDataSource } from "eloquents"
import { DataSource } from "typeorm"
import config from "eloquent.config"
import { User } from "@entity/User"
import { Role } from "@entity/Role"
import { UserRole } from "@entity/UserRole"
import { Activity } from "@entity/Activity"

const options: any = config

options.entities = [
    User,
    Role,
    UserRole,
    Activity
]

let connected: boolean = false

export default async () => {
    if(connected === false) {
        
        const dataSource = new DataSource(options)

        await dataSource.initialize().then(() => {
            console.log("Data Source init")
        }).catch((err) => {
            console.error(err)
            console.log("Data Source fail: " + err)
        })
        
        setDataSource('default', dataSource)

        connected = true
    }
}
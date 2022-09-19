import { setDataSource } from "eloquent.orm.js"
import { DataSource } from "typeorm"
import config from "eloquent.config"

class Connection {
    
    public static connected: boolean = false

    public static initialize: boolean = false

    public static awaitInitialization: Promise<void>;

    public static async createIfNotExists(datasource: string = 'default') {
        
        if(this.connected === false && this.initialize === false) {
            
            this.initialize = true

            const dataSource = new DataSource(config as any)
    
            this.awaitInitialization = dataSource.initialize().then(() => {

                console.log("Data Source is connected")

            }).catch((err) => {
                console.error("Data Source Error: " + err)
                console.error(err)
            })

            await this.awaitInitialization
            
            setDataSource(datasource, dataSource)
    
            this.connected = true

        } else if(this.connected === false && this.initialize === true) {

            await this.awaitInitialization

            this.connected = true

        }

        return true
    }

}

export default Connection
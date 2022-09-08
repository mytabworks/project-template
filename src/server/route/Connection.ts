import { NextApiRequest, NextApiResponse } from "next"
import { ConnectionPool, setDataSource } from "eloquents"
import { DataSource } from "typeorm"
import config from "eloquent.config"
import * as Entities from "@entity/index"

const options: any = config

options.entities = Object.values(Entities)

class Connection {
    
    public static connected: boolean = false

    public static initialize: boolean = false

    public static awaitInitialization: Promise<void>;

    public static async createIfNotExists() {
        
        if(this.connected === false && this.initialize === false) {
            
            this.initialize = true

            const dataSource = new DataSource(options)
    
            this.awaitInitialization = dataSource.initialize().then(() => {

                console.log("Data Source is connected")

            }).catch((err) => {
                console.error("Data Source Error: " + err)
                console.error(err)
            })

            await this.awaitInitialization
            
            setDataSource('default', dataSource)
    
            this.connected = true

        } else if(this.connected === false && this.initialize === true) {

            await this.awaitInitialization

        }

        return true
    }

}

export default Connection
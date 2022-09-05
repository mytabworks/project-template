import { NextApiRequest, NextApiResponse } from "next"
import { setDataSource } from "eloquents"
import { DataSource } from "typeorm"
import config from "eloquent.config"
import * as Entities from "@entity/index"

const options: any = config

options.entities = Object.values(Entities)

export class Connection {
    
    public static connected: boolean = false

    public static async handle(request: NextApiRequest, response: NextApiResponse<any>) {
        
        if(this.connected === false) {
        
            const dataSource = new DataSource(options)
    
            await dataSource.initialize().then(() => {

                console.log("Data Source is connected")

            }).catch((err) => {
                
                console.error("Data Source Error: " + err)
            })
            
            setDataSource('default', dataSource)
    
            this.connected = true
        }
    }

}
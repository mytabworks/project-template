import { DataSource } from "typeorm"
import dotenv from "dotenv"
import rootPath, { require as rootRequire } from "app-root-path"

dotenv.config({ path: rootPath + '/.env.development' })

const config = rootRequire('eloquent.config')

const options: any = config

const dataSource = new DataSource(options)

export default dataSource
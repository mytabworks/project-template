/** 
 * this is only an eloquent implementation work around on nextjs 
 * we need to export all the entities to include in the data source options 
 * see middleware/Connection.ts
 * */
export * from './User'
export * from './Role'
export * from './UserRole'
export * from './Activity'
export * from './UserProvider'
module.exports = {
	"type": process.env.DB_TYPE,
	"host": process.env.DB_HOST,
	"port": process.env.DB_PORT,
	"username": process.env.DB_USER,
	"password": process.env.DB_PASS,
	"database": process.env.DB_DATABASE,
	"synchronize": process.env.DB_SYNCHRONIZE,
	"logging": process.env.DB_LOGGING,
	"entities": [
		"server/entity/**/*.ts"
	],
	"migrations": [
		"server/migration/**/*.ts"
	],
	"subscribers": [
		"server/subscriber/**/*.ts"
	],
	"cli": {
		"entitiesDir": "server/entity",
		"migrationsDir": "server/migration",
		"subscribersDir": "server/subscriber"
	}
}
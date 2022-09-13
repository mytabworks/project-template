module.exports = {
	"type": process.env.DB_TYPE,
	"host": process.env.DB_HOST,
	"port": process.env.DB_PORT,
	"username": process.env.DB_USER,
	"password": process.env.DB_PASS,
	"database": process.env.DB_DATABASE,
	"synchronize": process.env.DB_SYNCHRONIZE === 'true',
	"logging": process.env.DB_LOGGING === 'true',
	"ssl": process.env.DB_HOST !== "localhost" ? {
		"rejectUnauthorized": process.env.NEXT_PUBLIC_ENV === "production"
	} : undefined,
	"migrationsRun": process.env.DB_MIGRATION_RUN === 'true',
	"entities": [
		"src/server/entity/**/*.ts"
	],
	"migrations": [
		"src/server/migration/**/*.ts"
	],
	"subscribers": [
		"src/server/subscriber/**/*.ts"
	],
	"cli": {
		"entitiesDir": "src/server/entity",
		"migrationsDir": "src/server/migration",
		"subscribersDir": "src/server/subscriber"
	}
}
# project-template
This is a template for nextjs setup with typeorm sits on eloquent

## migration scripts
The package script will only run on npm don't you ever use yarn on migration

Generate migration that has change on your entities
js`npm run migration:generate --file=TheMigrationFileName`

Run all migration files on /serve/migration folder
js`npm run migration:run`

## todo

1. jwt accessing - done
2. auth middleware with roles - done
3. file system upload and download
4. set components
5. soft deleting
6. eloquents created_at and updated_at change to actual date
7. email invite and email templating
8. Oauth integration - complete

## triage

1. setting up database (Heroku, Amazon)
2. setting up UAT, Production environment 
3. app upload to vercel
4. learn typeorm migration - partial

## future
1. push notificaiton
2. chat room
3. stripe payment
4. OTP, google authenticator
# project-template
This is a template for nextjs setup with typeorm sits on eloquent

## migration scripts
The package script will only run on npm don't you ever use yarn on migration

Generate migration that has change on your entities
js`npm run migration:generate --file=TheMigrationFileName`

Create migration
js`npm run migration:create --file=TheMigrationFileName`

Run all migration files on /serve/migration folder
js`npm run migration:run`

## todo

1. jwt accessing - done
2. auth middleware with roles - done
3. file system upload and download
https://www.youtube.com/watch?v=eQAIojcArRY
4. set components
5. soft deleting - done
6. eloquents created_at and updated_at change to actual date - done
7. email invite and email templating - partial business email https://www.youtube.com/watch?v=e94AFnJybKg
8. Oauth integration - complete
https://github.com/clavearnel/philippines-region-province-citymun-brgy/blob/master/mysql/refCitymun.sql
## triage

1. setting up database (Heroku, Amazon) - done
2. setting up UAT, Production environment 
3. app upload to vercel
4. learn typeorm migration - partial

## future
1. push notificaiton & PWA - setup
2. chat room & normal live notification
https://www.youtube.com/watch?v=HggSXt1Hzfk
https://www.youtube.com/watch?v=7vVqMR96T5o
3. stripe payment
4. OTP, google authenticator
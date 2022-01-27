# Speedyssey API backend

## Description

Speedyssey API backend

## Quick start
1. Make sure that you have <a href="https://nodejs.org/en/" rel="nofollow">Node.js</a>, <a href="https://classic.yarnpkg.com/lang/en/docs/install" rel="nofollow">yarn</a>, npm and <a href="https://www.postgresql.org/download/" rel="nofollow">PostgreSQL</a> installed.

3. Go to the project folder and open your CLI

3. Copy and paste this code
```bash
cp env-example .env
```
4. Create new database on postgresql

5. Change `DATABASE_HOST=localhost`

6. Change `DATABASE_USERNAME` to your database user name

7. Change `DATABASE_PASSWORD`  to your database password

8. Change `DATABASE_NAME`  to your newly created database

10. Run this commands: {note if this is your first setup please remove existing migration files you can find it on "\src\database\migrations" . }

Install Dependencies
```bash
yarn install
```
Generate migration

```bash
npm run migration:generate 
```

Run migration

```bash
npm run migration:run
```

Run seed

```bash
npm run seed:run
```

Start Project

```bash
npm run start
```

## Note
if you encountered `yarn install` error please check the node version on package.json file look for
`"engines": {
"node": "16.x"
}`
change the version


## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```
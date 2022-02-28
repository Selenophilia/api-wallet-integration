## API Wallet Integration
- basic backend-development and smart contract integration using AdonisJS framework

### Minimum Versions

- [Node](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V14.md#14.6.0) - 16.2.0 version
- [NPM](https://www.npmjs.com/package/download) - >= 3.0.0 
- [Git](https://git-scm.com/downloads)

### Prereq Setup
1. [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) or [Nodenv](https://github.com/nodenv/nodenv#installation) - For developers; Install Node 16.x
2. [PostgreSQL](https://www.postgresql.org/download/)
3. [Dbeaver](https://dbeaver.io/download/)

## Development Setup

1. `$ git clone git@github.com:Selenophilia/api-wallet-integration.git && cd backend-blockchain-exam`
2. `$ npm install`
3. `$ node ace serve --watch`

## Copy .env file.
1. `$ cp .env.example .env`


## Configure your local database
```
$ node ace configure @adonisjs/lucid
Select the database you want to use: 
  PostgreSQL

# It will let you choose if you want to open the configurations on terminal or browser. 

# copy your configurations on the `env.ts` file

# go to your .env file and add neccessary configurations 
  PG_HOST=localhost
  PG_PORT=5432
  PG_USER=user
  PG_PASSWORD=password
  PG_DB_NAME=user
```

# The Doorway Portal

SET UP
=======

Requirements:
* Mysql5
* Redis server
* Node@9x

Install mysql5, node@9x, yarn, pm2, nginx and a redis-server.
--------------------------------------------------------------
Create DB in mysql using: `api/dbs/sitedb.sql` or get the latest prod db dump.
--------------------------------------------------------------
Create config file `config/local.settings.js` (see config/local.settings.sample.js)
--------------------------------------------------------------

Setup and start web servers (api and web)
```
cd doorway
yarn start:dev
```

To create a new user:
```
cd doorway/api
yarn create:user
```

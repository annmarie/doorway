# The Doorway API Server

SET UP
=======

Requirements:
* Redis server
* Mysql5
* Node@9x

Install mysql5, node@9x, yarn, pm2 and a redis-server.
--------------------------------------------------------------
Create DB in mysql using: dbs/sitedb.sql or get the latest prod db dump.
--------------------------------------------------------------
Create config file `../config/local.settings.js` (see ../config/local.settings.sample.js)
--------------------------------------------------------------

To start:
```
yarn
yarn start
```

To create a new user:
```
yarn create:user
```

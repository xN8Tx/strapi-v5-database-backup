<h1 align="center">✨ Strapi Database Backup  ✨</h1>
<p align="center">Export and import your database backup from Strapi UI</p>

## 🚀 Installation

Install the plugin using your favorite package manager:

```sh
npm install strapi-v5-database-backup
```

or

```sh
yarn add strapi-v5-database-backup
```

## 📦 Requirements

To correct work this plugin you need to install additional package to get access to manipulate database on your machine:

- If you use SQLite:

```sh
// use package manager for your OS
sudo apt install sqlite3
```

- If you use MySQL:

```sh
// use package manager for your OS
sudo apt install mysql-client mariadb-connector-c
```

- If you use PostgreSQL:

```sh
// use package manager for your OS
sudo apt install postgresql
```

It's build for Strapi v5.
It has been tested to work with v5.4.2 and I assume it should keep working with later versions.

## ⚡ Features

- Create database and public folder backups
- Restore database and public folder from backup
- Manage backups in Strapi UI

## ✋ Need to know

- Your data you can find in `src/extentions/strapi-v5-database-backup` folder.

- This plugin shut down your strapi after restore data, this is because you need to restart your strapi to apply data to work. I doesn't find how i can do it in Strapi, so if you install this plugin and want restore data in production, you need to setup docker-compose with `restart: always` or use pm2.

- This plugin also restart your strapi in development mode when you create or restore data, this is because the plugin files create in `src` folder what toggle basic restore functions.

- This plugin work with: PostgreSQL, MySQL and SQLite.

## 🌟 Usage

Add the plugin to your Strapi project:

```js
// config/plugins.js
module.exports = () => {
 "strapi-v5-database-backup": {
    enabled: true,
  },
}
```

After that your plugin will be finally added to your Strapi project. You can find it in strapi sidebar.

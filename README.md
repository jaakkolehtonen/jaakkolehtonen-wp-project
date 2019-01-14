# Jaakko Lehtonen WP Project

## Requirements

* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) - `brew install heroku/brew/heroku`
* [PHP](http://www.php.net/) - `brew install php@7.2`
* [Composer](https://getcomposer.org/) - `brew install composer`
* [Nginx](https://nginx.org/en/) - `brew install nginx`
* [MariaDB](https://mariadb.org/) - `brew install mariadb`
* [NodeJS](https://nodejs.org/en/) - `brew install node` or [NVM](https://github.com/creationix/nvm)
* [Gulp CLI](https://gulpjs.com/) - `npm install -g gulp-cli`

## Setup

1. Remove `http { ... }` block from `/usr/local/etc/nginx/nginx.conf`
2. `brew services start --all` or:
    * `brew services start nginx`
    * `brew services start php@7.2`
    * `brew services start mariadb`
3. `mysql -u root`, `CREATE DATABASE database_name;`and `exit`
4. Update environment variables in the `.env` file:
    * `DB_NAME` - Database name
5. * `composer install`

## Development

1. `heroku local`
2. `cd /web/app/themes/jaakkolehtonen-wp-theme`
3. `npm install`

### Gulp Tasks

`gulp watch` - Automatically handle changes to CSS and JS. Also kicks off BrowserSync.

`gulp i18n` - Scan the theme and create a POT file.

`gulp sass:lint` - Run Sass against code standards.

`gulp js:lint` - Run Javascript against code standards.

`gulp scripts` - Concatenate and minify javascript files.

`gulp styles` - Compile, prefix, combine media queries, and minify CSS files.

`gulp` - Runs the following tasks at the same time: i18n, scripts, styles.
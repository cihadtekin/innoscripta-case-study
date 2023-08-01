# NewsFeed server
Case-study for innoscripta

## Requirements
- php^8.2
- composer^2.5
- Check the Dockerfile for required shared libraries and php extensions

## Installation
```sh
$ cd server
$ composer install
$ touch database/database.sqlite
$ php artisan migrate
```

## Configuration
- Copy .env.example and save as .env
- Fill these paramters: NEW_YORK_TIMES_IO_API_KEY, THE_GUARDIAN_IO_API_KEY, NEWSDATA_IO_API_KEY, JWT_SECRET 

## Seeding with articles and meta data
You can set the ARTICLES_PER_SOURCE env var. Default is 20.
```sh
$ php artisan db:seed
or
$ ARTICLES_PER_SOURCE=30 php artisan db:seed
```

## Starting dev server
```sh
$ php artisan serve
```

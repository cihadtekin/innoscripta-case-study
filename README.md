# NewsFeed
Case-study for innoscripta

## Requirements
- Docker^20.10
- docker-compose^1.29

## Configuration
Open the docker-compose.yml file and set these variables:
- NEW_YORK_TIMES_IO_API_KEY
- THE_GUARDIAN_IO_API_KEY
- NEWSDATA_IO_API_KEY
- JWT_SECRET
- VITE_REST_API
Nginx port is set to 80 by default. You can change the hostname from newsfeed-site.conf.

## Start the services
```sh
$ docker-compose up
```
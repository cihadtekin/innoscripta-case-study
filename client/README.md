# NewsFeed client
Case-study for innoscripta

## Requirements
- npm^9.6.7
- node^18.17.0

## Installation
```sh
$ cd client
$ npm install
```

## Configuration
Update the VITE_REST_API parameter in the corresponding .env file (it should end with a "/").

## Starting the dev server
```sh
$ npm run dev
```

## Build source files for deployment
```sh
$ npm run build
```

## Serve the built files
This will listen on 8080.
```sh
$ npm run preview
```
You can use the example newsfeed-site.conf in the parent directory to setup an nginx server for the client.
# Povio Assignment

Povio assignment for Node.js. It comes bundled with Docker and is CI/CD optimized. The development environment uses `docker-compose` to start dependent services like mongo.

A few things to note in the project:
* **[Github Actions Workflows](https://github.com/NerminImamovic/povioTask/tree/master/.github/workflows)** -
`ci.yml`, continuous integration for the project 

* **[Dockerfile](https://github.com/NerminImamovic/povioTask/blob/master/Dockerfile)** - Dockerfile to generate docker builds.

* **[docker-compose](https://github.com/NerminImamovic/povioTask/blob/master/docker-compose.yml)** - Docker compose script to start service in production mode.

* **[Containerized Mongo for development](#development)** - Starts a local mongo container with data persistence across runs.

* **[OpenAPI 3.0 Spec Swagger](https://github.com/NerminImamovic/povioTask/blob/master/swagger.json)** - A starter template to get started with API documentation using OpenAPI 3.0. This API spec is also available when running the development server at `http://localhost:3000`

* **[.env file for configuration](#environment)** - Change server config like app port, mongo url etc
* **[Winston Logger](#logging)** - Uses winston as the logger for the application.
* **ESLINT** - ESLINT is configured for linting.
* **Jest** - Using Jest for running test cases

## I. Installation


#### 1. Clone this repo

```
$ git clone git@github.com:NerminImamovic/povioTask
$ cd povioTask
```

#### 2. Install dependencies

```
$ npm install
```

## II. Configuration

Be sure that you have installed docker on your local machine, and any service related do Mongo is turned off. 

Configuration is provided in `env.default` file for development and local running, and in `env.test` for the test running. Also for making production build we have configuration in `docker-compose.yml` file.

Read more about **[environment variables](#environment)** used in the project.

## III. Development

### Start dev server
Starting the dev server also starts MongoDB as a service in a docker container using the compose script at `docker-compose.dev.yml`.

```
$ npm run dev
```
Running the above commands results in 
* **API Server** running at `http://localhost:3000/`
* **Swagger UI** at `http://localhost:3000/`
* **MongoDB** running at `mongodb://localhost:27017/`

(feel free to changes the env variables in .env.default)

## IV. Packaging and Deployment

#### 1. Build and run using npm scripts 

In the background `docker-compose.local.yml` will be started to provide mongodb service copying environment variables from `env.default`.

```
$ npm run build && npm run start
```

#### 2. Run with docker

We can make production build using docker.

Build docker image.

```
$ docker build -t api-server .
```

Start application using docker-compose.

```
$ docker-compose up
```

## V. Test

Run tests e2e tests using next npm script:

```
$ npm run test
```

---

## Environment
There are environment variables for development and test environments in files `env.default` and `env.test`. For production env variables are in `docker-compose.yml` file.

| Var Name  | Type  | Default | Description  |
|---|---|---|---|
| NODE_ENV  | string  | `development` |API runtime environment. eg: `staging`  |
|  PORT | number  | `3000` | Port to run the API server on |
|  MONGO_URL | string  | `mongodb://localhost:27017/users` | URL for MongoDB |
|  JWT_SECRET | string  | `secret` | Jwt Secret |


## Logging
The application uses [winston](https://github.com/winstonjs/winston) as the default logger. The configuration file is at `src/logger.ts`.

* Development and Test environments log errors in the console
* Production environment logs error in the files in `/log` folder

*Console messages are prettified 

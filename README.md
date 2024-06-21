# Athena Backend

## Description

Aplikasi Athena adalah aplikasi berbasis RTLT (Real Time Location Tracker) yang dirancang untuk melindungi perempuan dari kekerasan dan pelecehan seksual. Aplikasi ini dilengkapi dengan berbagai fitur seperti notifikasi bahaya di lokasi tertentu, pemetaan daerah tidak aman, chat, perekaman audio dan dokumentasi sebagai alat bukti, pesan anonim, serta media informatif tentang pelecehan/kekerasan seksual.

## Tech Stack

List all the technology we use to build the system in this project

- NestJS
- Typescript
- Prisma
- PostgresSQL
- AWS S3
- Supabase
- Google Maps API
- Socket.IO
- Passport
- Zod
- Jest

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your machine. If you want to use Docker instead of manual installation, you can skip these prerequisites.
- Node.js
- npm

```bash
# install dependency
$ npm install
```

### Environment Variables
```bash
# copy .env.example to .env 
$ cp .env.example .env

# open .env and modify the environment variables
$ nano .env
```

```bash
# PORT Number
PORT=3000

# Database
DATABASE_URL=postgres://<YOUR_DATABASE_USER>:<YOUR_DATABASE_PASSWORD>@<YOUR_DATABASE_HOST>:<YOUR_DATABASE_PORT>/<YOUR_DATABASE_NAME>

# JWT
JWT_SECRET=thisissupersecret
JWT_EXPIRES_IN=1d

# AWS S3
AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET>

```

### Running the app

```bash
# prisma generate
$ npx prisma generate

# build the application
$ npm run build

# start the application
$ npm run start:prod
```
Server is running on `localhost:3000`

### Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Installation using Docker
Make sure docker is running and execute these commands
```bash
# get docker image
$ docker pull ahargunyllib/athena-be:latest

# run the docker image on port 3000
$ docker run -p 3000:3000 ahargunyllib/athena-be:latest
```
Server is running on `localhost:3000`

## Credit

The member of our team

- Selvi (Hustler)
- Alfredo (Hipster)
- Nugraha Billy Viandy (Hacker)

## Useful Link

- [Documentation](https://documenter.getpostman.com/view/29496349/2sA3XWbdFR)

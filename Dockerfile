FROM node:18-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=${PUPPETEER_SKIP_CHROMIUM_DOWNLOAD}

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./tsconfig.json ./tsconfig.build.json ./nest-cli.json ./

RUN npm install --legacy-peer-deps

RUN npm install @babel/core@7.21.0 --legacy-peer-deps

WORKDIR /usr/src/app

COPY ./ .

RUN npx prisma generate

RUN npm run build

# get the database url from the environment variable
ARG DATABASE_URL=postgres://postgres:postgrespw@localhost:32768/kulucash

ENV DATABASE_URL=${DATABASE_URL}

RUN npm run db:dev:prod

EXPOSE 3000

CMD [ "npm", "run","start:prod" ]

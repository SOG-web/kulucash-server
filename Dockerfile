FROM node:16-slim

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

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY ./ .

RUN npx prisma generate

RUN npm run build


EXPOSE 3000

CMD [ "npm", "run","start:docker" ]

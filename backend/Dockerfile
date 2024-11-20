FROM node:22-alpine

RUN mkdir -p /app/backend

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./backend/package.json /app/backend
COPY ./backend/package-lock.json /app/backend

RUN npm config set registry=https://registry.npmjs.com/

RUN npm --loglevel=verbose install

COPY ./backend ./backend

RUN mkdir -p /app/shared
COPY ./shared ./shared

WORKDIR /app/backend

RUN npm run build

EXPOSE 3000

CMD ["npm", "run" ,"start:prod"]
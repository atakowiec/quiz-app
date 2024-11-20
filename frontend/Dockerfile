FROM node:22-alpine AS builder

WORKDIR /app

RUN mkdir -p /app/frontend

COPY ./package.json .
COPY ./package-lock.json .
COPY ./frontend/package.json ./frontend
COPY ./frontend/package-lock.json ./frontend

RUN npm config set registry=https://registry.npmjs.com/

RUN npm --loglevel=verbose install

COPY ./frontend /app/frontend

RUN mkdir -p /app/shared
COPY ./shared /app/shared

WORKDIR /app/frontend

RUN npm --loglevel=verbose run build

FROM nginx

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
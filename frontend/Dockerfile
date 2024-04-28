FROM node:12-alpine as builder

WORKDIR /frontend

COPY public .
COPY src .
COPY package.json .

RUN npm install



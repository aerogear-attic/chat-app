# Stage 1 - the build process
FROM node:10 as build-deps

ARG SERVER_URL

WORKDIR /usr/src/app
COPY ./client ./client
COPY ./server ./server
WORKDIR /usr/src/app/client
RUN yarn install
RUN yarn codegen
RUN REACT_APP_SERVER_URL=$SERVER_URL yarn build

# Stage 2 - the production environment
FROM node:10
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app/client/build ./build
COPY ./client/server.js ./server.js
RUN yarn add express
RUN yarn add morgan
EXPOSE 8080
CMD ["node", "server.js"]
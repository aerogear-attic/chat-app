# Stage 1 - the build process
FROM node:10 as build-deps
WORKDIR /usr/src/app
COPY ./client ./client
COPY ./server ./server
WORKDIR /usr/src/app/client
RUN yarn install
RUN yarn codegen
RUN yarn build

# Stage 2 - the production environment
FROM node:10
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app/client/build ./client/build
COPY ./server ./server
WORKDIR /usr/src/app/server
RUN yarn install
RUN yarn codegen
EXPOSE 4000
CMD ["npm", "start"]
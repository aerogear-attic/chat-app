# Stage 1 - the build process
FROM node:10 as build-deps

ARG server_url

WORKDIR /usr/src/app
COPY ./client ./client
COPY ./server ./server
WORKDIR /usr/src/app/client
RUN yarn install
RUN yarn codegen
RUN REACT_APP_SERVER_URL=$server_url yarn build

# Stage 2 - the production environment
FROM nginxinc/nginx-unprivileged
COPY --from=build-deps /usr/src/app/client/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
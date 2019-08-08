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
FROM nginx:alpine
COPY --from=build-deps /usr/src/app/client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
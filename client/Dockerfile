FROM node:10
WORKDIR /usr/src/app
COPY ./client/build ./build
COPY ./client/server.js ./server.js
RUN yarn add express
RUN yarn add morgan
EXPOSE 8080
CMD ["node", "server.js"]
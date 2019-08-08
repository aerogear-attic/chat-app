FROM node:8

WORKDIR /app

COPY . .
RUN yarn install
# let docker eng know that we intend to run our app on port 4000
EXPOSE 4000
CMD [ "yarn", "start" ]
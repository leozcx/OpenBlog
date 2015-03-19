FROM node:latest
ADD . /app
WORKDIR /app
RUN npm install
ENTRYPOINT npm start

FROM node:6.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install; exit 0
RUN npm build

EXPOSE 3000
CMD [ "npm", "run", "start" ]

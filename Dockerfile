FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install prom-client socket.io-prometheus

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
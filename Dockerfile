FROM amd64/node:16-alpine3.11

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install prom-client socket.io-prometheus

COPY app.js .
COPY index.html .

CMD [ "node", "app.js" ]
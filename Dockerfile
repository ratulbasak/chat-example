FROM amd64/node:16-alpine3.11

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY app.js .
COPY index.html .

CMD [ "node", "app.js" ]
FROM node:18-alpine3.17
WORKDIR /app

COPY src ./src/
COPY package.json ./
RUN npm install

CMD [ "node", "/app/src/app.js" ]
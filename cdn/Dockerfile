FROM node:18.0.0-buster-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8787

CMD [ "npm", "start" ]
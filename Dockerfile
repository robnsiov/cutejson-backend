FROM node:23-alpine3.19

RUN mkdir /app
WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci --only=production

COPY . /app

EXPOSE 8086

CMD ["npm", "run", "start"]

FROM node:12

WORKDIR /app

ENV NODE_ENV development

COPY package*.json ./

RUN npm i -g tsc-watch typescript && npm i

COPY . .

CMD ["npm", "run", "dev"]
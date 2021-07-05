FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install peer -g
COPY . .


EXPOSE 3000 3001 3002 9000 4000


CMD ["npm", "run","start"]
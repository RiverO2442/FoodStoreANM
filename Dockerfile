FROM node:alpine
WORKDIR /app
ADD package*.json .
RUN npm install
ADD . .
WORKDIR /app/client
RUN npm install
WORKDIR /app
CMD npm run dev

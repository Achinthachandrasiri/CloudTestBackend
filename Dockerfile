FROM node:24.18.0-alpine3.24

WORKDIR /app

COPY ./ ./

RUN npm install 

CMD ["npm", "start"]
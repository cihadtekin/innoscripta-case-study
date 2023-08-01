FROM node:18.17.0

WORKDIR /usr/src

COPY package*.json ./
RUN npm install

ARG VITE_REST_API="https://default-rest-api-url/api/"
COPY . .
RUN VITE_REST_API=$VITE_REST_API npm run build

EXPOSE 8080

CMD [ "npm", "run", "preview" ]
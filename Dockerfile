FROM node:22.17.0-alpine

EXPOSE 4321

WORKDIR /home/app

COPY package*.json .

#ci --omit=dev
RUN npm  i

COPY . .

RUN npm run build

CMD [ "npm", "run" , "preview" ]
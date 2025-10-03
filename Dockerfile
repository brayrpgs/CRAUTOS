FROM node:22.17.0

RUN mkdir -p /home/app

EXPOSE 4321

WORKDIR /home/app

COPY . .

RUN npm i

RUN npm run build

CMD [ "npm", "run" , "preview" ]
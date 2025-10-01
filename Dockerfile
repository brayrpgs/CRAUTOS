FROM node:22.17.0

RUN mkdir -p /home/app

EXPOSE 4321

WORKDIR /home/app

COPY . .

RUN nmp run build

CMD [ "npm", "run" , "preview" ]
FROM node:12-alpine

WORKDIR /projects
COPY . /projects/sc-user-login-service

WORKDIR /projects/sc-user-login-service
RUN npm install

CMD ["node", "app.js"]
# FROM node:latest
# EXPOSE 4200 8080
# EXPOSE 443
# # # install chrome for protractor tests
# # RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# # RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# # RUN apt-get update && apt-get install -yq google-chrome-stable
# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH
# # set working directory
# WORKDIR /app
# # install and cache app dependencies
# COPY package.json ./package.json
# RUN npm install
# RUN npm install -g @angular/cli@7.3.9
# # add app
# COPY . /app
# # RUN npm run mock-server
# # start app
# CMD ng serve --host 0.0.0.0

FROM node:lts-alpine as build

WORKDIR /client

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine as runtime
WORKDIR /client
COPY --from=build /client/dist/* /usr/share/nginx/html
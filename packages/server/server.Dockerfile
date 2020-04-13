FROM node:12

WORKDIR /usr/src/client

# install dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --pure-lockfile

# copy source
COPY . .

CMD ["yarn", "start"]

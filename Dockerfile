FROM node:16 as install

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production=true

FROM node:16 as build

# Создаем дирректорию для приложения
WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build


FROM node:16

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get -y update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist /app
COPY --from=install /app/node_modules /app/node_modules

CMD ["node", "index.js"]

FROM node:20-alpine as base

WORKDIR /app

# Устанавливаем необходимые пакеты и Google Chrome
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --production=true

FROM base as build

COPY . .

# Собираем приложение
RUN yarn install
RUN yarn build

FROM base

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules

CMD ["node", "dist/index.js"]
FROM node:16 as build

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY . .

# Устанавливаем Puppeteer без Chromium
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install
RUN yarn build

FROM node:16

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get -y update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install \
    && rm -rf /var/lib/apt/lists/* google-chrome-stable_current_amd64.deb

COPY --from=build /app/dist /app
COPY --from=build /app/node_modules /app/node_modules

CMD ["node", "index.js"]
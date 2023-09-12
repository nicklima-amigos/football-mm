FROM node:18.17.1
RUN npm install -g bun

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

RUN bun run build

CMD ["bun", "run", "./dist/main.js"]

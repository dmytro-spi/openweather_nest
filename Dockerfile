FROM node:22-slim as build

WORKDIR /app

ENV NODE_ENV production

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

# Production image
FROM node:22-slim as production

WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/package*.json ./

COPY --from=build /app/dist ./dist

COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]

# Development image
FROM node:22-slim as development

WORKDIR /app

ENV NODE_ENV development

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]

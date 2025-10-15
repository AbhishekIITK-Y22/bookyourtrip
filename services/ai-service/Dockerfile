FROM node:20-alpine3.16 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install

FROM node:20-alpine3.16 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build without generating Prisma client to avoid network flakiness during build
RUN npm run build

FROM node:20-alpine3.16
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --omit=dev --ignore-scripts || npm install --omit=dev --ignore-scripts
EXPOSE 3003
CMD ["node", "dist/index.js"]



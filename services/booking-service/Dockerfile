FROM node:20-alpine3.16 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install

FROM node:20-alpine3.16 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine3.16
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY prisma ./prisma
RUN npm install --omit=dev --ignore-scripts || true && npx prisma generate || true
EXPOSE 3002
CMD ["node", "dist/index.js"]



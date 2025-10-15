FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Use ci if lockfile exists, otherwise fallback to install
RUN [ -f package-lock.json ] && npm ci || npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]


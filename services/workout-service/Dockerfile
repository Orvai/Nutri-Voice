FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma/ ./prisma/
RUN npx prisma generate

COPY src/ ./src/

RUN mkdir -p src/uploads/videos

EXPOSE 4003

CMD ["node", "src/index.js"]

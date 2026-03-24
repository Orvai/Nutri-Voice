FROM node:20-alpine

WORKDIR /app/client-app

COPY client-app/package.json ./
RUN npm install

COPY common/ /app/common/

COPY client-app/app/ ./app/
COPY client-app/src/ ./src/
COPY client-app/app.json ./
COPY client-app/babel.config.js ./
COPY client-app/metro.config.js ./
COPY client-app/tsconfig.json ./

RUN printf '/// <reference types="expo/types" />\n' > expo-env.d.ts

EXPOSE 8082

ENV EXPO_USE_METRO_WORKSPACE_ROOT=1

CMD ["npx", "expo", "start", "--web", "--port", "8082", "--host", "lan"]

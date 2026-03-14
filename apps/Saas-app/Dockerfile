FROM node:20-alpine

WORKDIR /app/Saas-app

# Copy package files and install dependencies
COPY Saas-app/package.json Saas-app/package-lock.json ./
RUN npm ci

# Copy the shared common API SDK
COPY common/ /app/common/

# Copy app source
COPY Saas-app/app/ ./app/
COPY Saas-app/src/ ./src/
COPY Saas-app/app.json ./
COPY Saas-app/babel.config.js ./
COPY Saas-app/metro.config.js ./
COPY Saas-app/tsconfig.json ./
COPY Saas-app/expo-env.d.ts ./

EXPOSE 8081

ENV EXPO_USE_METRO_WORKSPACE_ROOT=1

CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "lan"]

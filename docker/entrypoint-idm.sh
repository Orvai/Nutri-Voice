#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting Prisma Studio on port 5555..."
npx prisma studio --port 5555 --browser none --hostname 0.0.0.0 &

echo "Starting application..."
exec node "$@"

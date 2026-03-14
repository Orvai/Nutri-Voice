#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

if [ -n "$STUDIO_PORT" ]; then
  echo "Starting Prisma Studio on port $STUDIO_PORT..."
  npx prisma studio --port "$STUDIO_PORT" --browser none --hostname 0.0.0.0 &
fi

echo "Starting application..."
exec node "$@"

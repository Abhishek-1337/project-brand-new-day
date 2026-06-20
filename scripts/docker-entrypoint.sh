#!/bin/sh
set -e

echo "Applying database schema..."
npx prisma db push --skip-generate

# If running as root (Docker default), set up upload directory permissions
# then drop privileges to the nextjs user
if [ "$(id -u)" = "0" ]; then
  echo "Setting up uploads directory..."
  mkdir -p /app/public/uploads
  chown -R nextjs:nodejs /app/public/uploads

  echo "Starting Next.js server..."
  exec su-exec nextjs node server.js
fi

echo "Starting Next.js server..."
exec node server.js

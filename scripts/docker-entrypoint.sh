#!/bin/sh
set -e

# Optional startup schema sync. Enable only when explicitly requested.
if [ "${PRISMA_DB_PUSH_ON_STARTUP:-false}" = "true" ]; then
  echo "Applying database schema..."

  if [ -x /app/node_modules/.bin/prisma ] || command -v prisma >/dev/null 2>&1; then
    if [ -x /app/node_modules/.bin/prisma ]; then
      /app/node_modules/.bin/prisma db push --skip-generate
    else
      npx prisma db push --skip-generate
    fi
  else
    echo "Prisma CLI not found in runtime image; skipping schema push."
  fi
fi

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

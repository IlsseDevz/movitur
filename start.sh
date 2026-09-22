#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  raw="$DATABASE_URL"
  raw="${raw#postgres://}"
  raw="${raw#postgresql://}"
  userpass="${raw%%@*}"
  hostdb="${raw#*@}"
  user="${userpass%%:*}"
  pass="${userpass#*:}"
  hostport="${hostdb%%/*}"
  dbq="${hostdb#*/}"
  db="${dbq%%\?*}"
  host="${hostport%%:*}"
  port="${hostport#*:}"
  if [ "$port" = "$host" ]; then
    port="5432"
  fi
  export MOVITUR_DB_URL="jdbc:postgresql://${host}:${port}/${db}?sslmode=require"
  export MOVITUR_DB_USER="$user"
  export MOVITUR_DB_PASS="$pass"
  export MOVITUR_DB_DRIVER="org.postgresql.Driver"
fi

if [ -n "$RENDER_EXTERNAL_URL" ] && [ -z "$MOVITUR_APP_URL" ]; then
  export MOVITUR_APP_URL="$RENDER_EXTERNAL_URL"
fi

if [ -n "$MOVITUR_JWT_SECRET" ]; then
  if ! printf '%s' "$MOVITUR_JWT_SECRET" | base64 -d >/dev/null 2>&1; then
    export MOVITUR_JWT_SECRET="$(printf '%s' "$MOVITUR_JWT_SECRET" | base64 | tr -d '\n')"
  fi
fi

export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-prod}"
export PORT="${PORT:-8080}"

exec java -jar /app/app.jar

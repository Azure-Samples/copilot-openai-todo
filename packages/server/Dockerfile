# syntax=docker/dockerfile:1

# Build Node.js app
# ------------------------------------
FROM node:18-alpine as build
WORKDIR /app
COPY ./package*.json ./
COPY ./packages/server ./packages/server
RUN npm ci --cache /tmp/empty-cache
RUN npm run build --workspace=server

# Run Node.js app
# ------------------------------------
FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app
COPY ./package*.json ./
COPY ./packages/server/package.json ./packages/server/
RUN npm ci --omit=dev --workspace=server --cache /tmp/empty-cache
COPY --from=build app/packages/server/lib packages/server/lib
EXPOSE 3000
CMD [ "npm", "start", "--workspace=server" ]

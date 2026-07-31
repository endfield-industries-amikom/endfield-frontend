FROM node:23-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:23-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:23-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
# Generate .env from BuildKit secrets — secrets are NOT persisted in the image
RUN --mount=type=secret,id=DEPLOY_TARGET \
    --mount=type=secret,id=API_GATEWAY_URL \
    --mount=type=secret,id=CDN_USED \
    --mount=type=secret,id=CDN_BASE_URL \
    --mount=type=secret,id=VITE_CDN_URL \
    sh -c '> .env; \
      for secret in DEPLOY_TARGET API_GATEWAY_URL CDN_USED CDN_BASE_URL VITE_CDN_URL; do \
        printf "%s=%s\n" "$secret" "$(cat /run/secrets/$secret)" >> .env.production; \
      done && \
      npm run build-local-prod'

FROM node:23-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]

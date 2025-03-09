  # -----------------------------------
  # Base Stage
  # -----------------------------------
  FROM node:23.9-slim AS base

  ENV PNPM_HOME="/pnpm"
  ENV PATH="$PNPM_HOME:$PATH"
  RUN corepack enable && corepack prepare pnpm --activate
  WORKDIR /app
  
  # -----------------------------------
  # Install dependencies and cache them
  # -----------------------------------
    
  FROM base AS builder
  
  ENV CI=true

  COPY ./package*.json ./
  COPY ./pnpm-lock.yaml ./
  COPY ./pnpm-workspace.yaml ./
  COPY ./.npmrc ./
  COPY ./tsconfig.json ./
  COPY ./apps/client/package.json ./apps/client/
  COPY ./apps/server/package.json ./apps/server/
  COPY ./packages/shared-schemas/package.json ./packages/shared-schemas/package.json

  RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

  WORKDIR /app
  COPY ./apps/server ./apps/server
  
  COPY ./packages/shared-schemas ./packages/shared-schemas
  WORKDIR /app/packages/shared-schemas
  RUN pnpm run build

  WORKDIR /app
  COPY ./apps/client ./apps/client

  WORKDIR /app/apps/client
  RUN pnpm run build

  WORKDIR /app/apps/server
  RUN pnpm run build

  # -----------------------------------
  # Build, test and prune
  # -----------------------------------

  WORKDIR /app
  RUN pnpm run test 

  RUN pnpm --filter ./apps/server --prod deploy pruned

  # -----------------------------------
  # Deploy
  # -----------------------------------

  FROM node:23.9-alpine
  WORKDIR /app
  
  COPY --from=builder /app/pruned/dist/src ./src
  COPY --from=builder /app/pruned/dist/package.json ./
  COPY --from=builder /app/pruned/dist/drizzle.config.js ./

  COPY --from=builder /app/pruned/node_modules ./node_modules

  COPY --from=builder /app/apps/server/_static ./_static

  EXPOSE 3000
  CMD ["npm", "run", "start"] 
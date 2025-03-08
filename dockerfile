  # -----------------------------------
  # Base Stage
  # -----------------------------------
  FROM node:23.9-slim as base

  ENV PNPM_HOME="/pnpm"
  ENV PATH="$PNPM_HOME:$PATH"
  RUN corepack enable
  WORKDIR /app
  
  # -----------------------------------
  # Install dependencies and cache them
  # -----------------------------------
    
  FROM base AS builder
  
  COPY ./package*.json ./
  COPY ./pnpm-lock.yaml ./
  COPY ./apps/client/package.json ./apps/client/
  COPY ./apps/server/package.json ./apps/server/
  COPY ./packages/shared-schemas/package.json ./packages/shared-schemas

  RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

  COPY . .

  # -----------------------------------
  # Build, test and prune
  # -----------------------------------

  RUN pnpm run build 
  RUN pnpm run test 

  RUN pnpm --filter ./apps/server --prod deploy pruned

  # -----------------------------------
  # Deploy
  # -----------------------------------

  FROM node:23.9-alpine
  WORKDIR /app
  
  ENV NODE_ENV=production
  
  COPY --from=builder /app/pruned .
  EXPOSE 3000
  
  CMD ["pnpm", "run", "start"] 
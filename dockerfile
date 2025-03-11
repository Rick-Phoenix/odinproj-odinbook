  # -----------------------------------
  # Base Stage
  # -----------------------------------
  FROM node:23.9-alpine AS base

  ENV PNPM_HOME="/pnpm"
  ENV PATH="$PNPM_HOME:$PATH"
  RUN corepack enable && corepack prepare pnpm --activate
  WORKDIR /app
  
  # -----------------------------------
  # Install dependencies and cache them
  # -----------------------------------
    
  FROM base AS builder
  
  ENV CI=true

  COPY . . 
  RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
  
  ## -----------------------------------
  ## Build, test and prune
  ## -----------------------------------
  
  RUN pnpm run build
  RUN --mount=type=cache,id=pnpm2,target=/pnpm/store pnpm --filter ./apps/server --prod deploy pruned

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


  # -----------------------------------
  # Base Stage
  # -----------------------------------
  FROM node:23.9-slim AS base

  ENV PNPM_HOME="/pnpm"
  ENV PATH="$PNPM_HOME:$PATH"
  RUN corepack enable
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
  COPY ./apps/client/package.json ./apps/client/
  COPY ./apps/server/package.json ./apps/server/
  COPY ./packages/shared-schemas/package.json ./packages/shared-schemas/package.json

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
  
  COPY --from=builder /app/pruned/dist/* ./

  COPY --from=builder /app/pruned/node_modules ./node_modules

  COPY --from=builder /app/pruned/_static ./_static

  EXPOSE 3000
  CMD ["npm", "run", "start"] 
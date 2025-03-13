FROM node:23.9-alpine AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm --activate

COPY .npmrc .
COPY package.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY turbo.json .
COPY ./apps/server/package.json /app/apps/server/package.json
COPY ./apps/client/package.json /app/apps/client/package.json
COPY ./packages/shared-schemas/package.json /app/packages/shared-schemas/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

EXPOSE 3000
EXPOSE 5173
CMD [ "pnpm", "run" ,"dev" ]
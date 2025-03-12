FROM node:23.9-alpine AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm --activate

FROM base AS install
WORKDIR /app

COPY .npmrc .
COPY package.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY ./apps/server/package.json ./apps/server
COPY ./apps/client/package.json ./apps/client
COPY ./packages/shared-schemas/package.json ./packages/shared-schemas

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

EXPOSE 3010
CMD [ "pnpm run dev" ]
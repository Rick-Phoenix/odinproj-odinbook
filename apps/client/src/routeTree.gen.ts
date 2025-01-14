/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ThirdImport } from './routes/third'
import { Route as LoginImport } from './routes/login'
import { Route as AuthImport } from './routes/_auth'
import { Route as IndexImport } from './routes/index'
import { Route as AuthDashImport } from './routes/_auth/dash'

// Create/Update Routes

const ThirdRoute = ThirdImport.update({
  id: '/third',
  path: '/third',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthDashRoute = AuthDashImport.update({
  id: '/dash',
  path: '/dash',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/third': {
      id: '/third'
      path: '/third'
      fullPath: '/third'
      preLoaderRoute: typeof ThirdImport
      parentRoute: typeof rootRoute
    }
    '/_auth/dash': {
      id: '/_auth/dash'
      path: '/dash'
      fullPath: '/dash'
      preLoaderRoute: typeof AuthDashImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

interface AuthRouteChildren {
  AuthDashRoute: typeof AuthDashRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthDashRoute: AuthDashRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AuthRouteWithChildren
  '/login': typeof LoginRoute
  '/third': typeof ThirdRoute
  '/dash': typeof AuthDashRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AuthRouteWithChildren
  '/login': typeof LoginRoute
  '/third': typeof ThirdRoute
  '/dash': typeof AuthDashRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_auth': typeof AuthRouteWithChildren
  '/login': typeof LoginRoute
  '/third': typeof ThirdRoute
  '/_auth/dash': typeof AuthDashRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/login' | '/third' | '/dash'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/login' | '/third' | '/dash'
  id: '__root__' | '/' | '/_auth' | '/login' | '/third' | '/_auth/dash'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthRoute: typeof AuthRouteWithChildren
  LoginRoute: typeof LoginRoute
  ThirdRoute: typeof ThirdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthRoute: AuthRouteWithChildren,
  LoginRoute: LoginRoute,
  ThirdRoute: ThirdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_auth",
        "/login",
        "/third"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/dash"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/third": {
      "filePath": "third.tsx"
    },
    "/_auth/dash": {
      "filePath": "_auth/dash.tsx",
      "parent": "/_auth"
    }
  }
}
ROUTE_MANIFEST_END */

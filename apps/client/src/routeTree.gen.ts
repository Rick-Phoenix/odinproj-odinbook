/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignupImport } from './routes/signup'
import { Route as PostImport } from './routes/post'
import { Route as LoginImport } from './routes/login'
import { Route as AppImport } from './routes/_app'
import { Route as IndexImport } from './routes/index'
import { Route as AppRoomsIndexImport } from './routes/_app/rooms/index'
import { Route as AppMarketplaceIndexImport } from './routes/_app/marketplace/index'
import { Route as AppChatsIndexImport } from './routes/_app/chats/index'
import { Route as AppUsersUsernameImport } from './routes/_app/users/$username'
import { Route as AppRoomsStarredImport } from './routes/_app/rooms/starred'
import { Route as AppChatsChatIdImport } from './routes/_app/chats/$chatId'
import { Route as AppRoomsRoomNameIndexImport } from './routes/_app/rooms/$roomName/index'
import { Route as AppMarketplaceCategoryIndexImport } from './routes/_app/marketplace/$category/index'
import { Route as AppMarketplaceCategoryItemIdImport } from './routes/_app/marketplace/$category/$itemId'
import { Route as AppRoomsRoomNamePostsIndexImport } from './routes/_app/rooms/$roomName/posts/index'
import { Route as AppRoomsRoomNamePostsPostIdImport } from './routes/_app/rooms/$roomName/posts/$postId'

// Create/Update Routes

const SignupRoute = SignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const PostRoute = PostImport.update({
  id: '/post',
  path: '/post',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AppRoomsIndexRoute = AppRoomsIndexImport.update({
  id: '/rooms/',
  path: '/rooms/',
  getParentRoute: () => AppRoute,
} as any)

const AppMarketplaceIndexRoute = AppMarketplaceIndexImport.update({
  id: '/marketplace/',
  path: '/marketplace/',
  getParentRoute: () => AppRoute,
} as any)

const AppChatsIndexRoute = AppChatsIndexImport.update({
  id: '/chats/',
  path: '/chats/',
  getParentRoute: () => AppRoute,
} as any)

const AppUsersUsernameRoute = AppUsersUsernameImport.update({
  id: '/users/$username',
  path: '/users/$username',
  getParentRoute: () => AppRoute,
} as any)

const AppRoomsStarredRoute = AppRoomsStarredImport.update({
  id: '/rooms/starred',
  path: '/rooms/starred',
  getParentRoute: () => AppRoute,
} as any)

const AppChatsChatIdRoute = AppChatsChatIdImport.update({
  id: '/chats/$chatId',
  path: '/chats/$chatId',
  getParentRoute: () => AppRoute,
} as any)

const AppRoomsRoomNameIndexRoute = AppRoomsRoomNameIndexImport.update({
  id: '/rooms/$roomName/',
  path: '/rooms/$roomName/',
  getParentRoute: () => AppRoute,
} as any)

const AppMarketplaceCategoryIndexRoute =
  AppMarketplaceCategoryIndexImport.update({
    id: '/marketplace/$category/',
    path: '/marketplace/$category/',
    getParentRoute: () => AppRoute,
  } as any)

const AppMarketplaceCategoryItemIdRoute =
  AppMarketplaceCategoryItemIdImport.update({
    id: '/marketplace/$category/$itemId',
    path: '/marketplace/$category/$itemId',
    getParentRoute: () => AppRoute,
  } as any)

const AppRoomsRoomNamePostsIndexRoute = AppRoomsRoomNamePostsIndexImport.update(
  {
    id: '/rooms/$roomName/posts/',
    path: '/rooms/$roomName/posts/',
    getParentRoute: () => AppRoute,
  } as any,
)

const AppRoomsRoomNamePostsPostIdRoute =
  AppRoomsRoomNamePostsPostIdImport.update({
    id: '/rooms/$roomName/posts/$postId',
    path: '/rooms/$roomName/posts/$postId',
    getParentRoute: () => AppRoute,
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
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/post': {
      id: '/post'
      path: '/post'
      fullPath: '/post'
      preLoaderRoute: typeof PostImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupImport
      parentRoute: typeof rootRoute
    }
    '/_app/chats/$chatId': {
      id: '/_app/chats/$chatId'
      path: '/chats/$chatId'
      fullPath: '/chats/$chatId'
      preLoaderRoute: typeof AppChatsChatIdImport
      parentRoute: typeof AppImport
    }
    '/_app/rooms/starred': {
      id: '/_app/rooms/starred'
      path: '/rooms/starred'
      fullPath: '/rooms/starred'
      preLoaderRoute: typeof AppRoomsStarredImport
      parentRoute: typeof AppImport
    }
    '/_app/users/$username': {
      id: '/_app/users/$username'
      path: '/users/$username'
      fullPath: '/users/$username'
      preLoaderRoute: typeof AppUsersUsernameImport
      parentRoute: typeof AppImport
    }
    '/_app/chats/': {
      id: '/_app/chats/'
      path: '/chats'
      fullPath: '/chats'
      preLoaderRoute: typeof AppChatsIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/marketplace/': {
      id: '/_app/marketplace/'
      path: '/marketplace'
      fullPath: '/marketplace'
      preLoaderRoute: typeof AppMarketplaceIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/rooms/': {
      id: '/_app/rooms/'
      path: '/rooms'
      fullPath: '/rooms'
      preLoaderRoute: typeof AppRoomsIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/marketplace/$category/$itemId': {
      id: '/_app/marketplace/$category/$itemId'
      path: '/marketplace/$category/$itemId'
      fullPath: '/marketplace/$category/$itemId'
      preLoaderRoute: typeof AppMarketplaceCategoryItemIdImport
      parentRoute: typeof AppImport
    }
    '/_app/marketplace/$category/': {
      id: '/_app/marketplace/$category/'
      path: '/marketplace/$category'
      fullPath: '/marketplace/$category'
      preLoaderRoute: typeof AppMarketplaceCategoryIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/rooms/$roomName/': {
      id: '/_app/rooms/$roomName/'
      path: '/rooms/$roomName'
      fullPath: '/rooms/$roomName'
      preLoaderRoute: typeof AppRoomsRoomNameIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/rooms/$roomName/posts/$postId': {
      id: '/_app/rooms/$roomName/posts/$postId'
      path: '/rooms/$roomName/posts/$postId'
      fullPath: '/rooms/$roomName/posts/$postId'
      preLoaderRoute: typeof AppRoomsRoomNamePostsPostIdImport
      parentRoute: typeof AppImport
    }
    '/_app/rooms/$roomName/posts/': {
      id: '/_app/rooms/$roomName/posts/'
      path: '/rooms/$roomName/posts'
      fullPath: '/rooms/$roomName/posts'
      preLoaderRoute: typeof AppRoomsRoomNamePostsIndexImport
      parentRoute: typeof AppImport
    }
  }
}

// Create and export the route tree

interface AppRouteChildren {
  AppChatsChatIdRoute: typeof AppChatsChatIdRoute
  AppRoomsStarredRoute: typeof AppRoomsStarredRoute
  AppUsersUsernameRoute: typeof AppUsersUsernameRoute
  AppChatsIndexRoute: typeof AppChatsIndexRoute
  AppMarketplaceIndexRoute: typeof AppMarketplaceIndexRoute
  AppRoomsIndexRoute: typeof AppRoomsIndexRoute
  AppMarketplaceCategoryItemIdRoute: typeof AppMarketplaceCategoryItemIdRoute
  AppMarketplaceCategoryIndexRoute: typeof AppMarketplaceCategoryIndexRoute
  AppRoomsRoomNameIndexRoute: typeof AppRoomsRoomNameIndexRoute
  AppRoomsRoomNamePostsPostIdRoute: typeof AppRoomsRoomNamePostsPostIdRoute
  AppRoomsRoomNamePostsIndexRoute: typeof AppRoomsRoomNamePostsIndexRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppChatsChatIdRoute: AppChatsChatIdRoute,
  AppRoomsStarredRoute: AppRoomsStarredRoute,
  AppUsersUsernameRoute: AppUsersUsernameRoute,
  AppChatsIndexRoute: AppChatsIndexRoute,
  AppMarketplaceIndexRoute: AppMarketplaceIndexRoute,
  AppRoomsIndexRoute: AppRoomsIndexRoute,
  AppMarketplaceCategoryItemIdRoute: AppMarketplaceCategoryItemIdRoute,
  AppMarketplaceCategoryIndexRoute: AppMarketplaceCategoryIndexRoute,
  AppRoomsRoomNameIndexRoute: AppRoomsRoomNameIndexRoute,
  AppRoomsRoomNamePostsPostIdRoute: AppRoomsRoomNamePostsPostIdRoute,
  AppRoomsRoomNamePostsIndexRoute: AppRoomsRoomNamePostsIndexRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AppRouteWithChildren
  '/login': typeof LoginRoute
  '/post': typeof PostRoute
  '/signup': typeof SignupRoute
  '/chats/$chatId': typeof AppChatsChatIdRoute
  '/rooms/starred': typeof AppRoomsStarredRoute
  '/users/$username': typeof AppUsersUsernameRoute
  '/chats': typeof AppChatsIndexRoute
  '/marketplace': typeof AppMarketplaceIndexRoute
  '/rooms': typeof AppRoomsIndexRoute
  '/marketplace/$category/$itemId': typeof AppMarketplaceCategoryItemIdRoute
  '/marketplace/$category': typeof AppMarketplaceCategoryIndexRoute
  '/rooms/$roomName': typeof AppRoomsRoomNameIndexRoute
  '/rooms/$roomName/posts/$postId': typeof AppRoomsRoomNamePostsPostIdRoute
  '/rooms/$roomName/posts': typeof AppRoomsRoomNamePostsIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AppRouteWithChildren
  '/login': typeof LoginRoute
  '/post': typeof PostRoute
  '/signup': typeof SignupRoute
  '/chats/$chatId': typeof AppChatsChatIdRoute
  '/rooms/starred': typeof AppRoomsStarredRoute
  '/users/$username': typeof AppUsersUsernameRoute
  '/chats': typeof AppChatsIndexRoute
  '/marketplace': typeof AppMarketplaceIndexRoute
  '/rooms': typeof AppRoomsIndexRoute
  '/marketplace/$category/$itemId': typeof AppMarketplaceCategoryItemIdRoute
  '/marketplace/$category': typeof AppMarketplaceCategoryIndexRoute
  '/rooms/$roomName': typeof AppRoomsRoomNameIndexRoute
  '/rooms/$roomName/posts/$postId': typeof AppRoomsRoomNamePostsPostIdRoute
  '/rooms/$roomName/posts': typeof AppRoomsRoomNamePostsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_app': typeof AppRouteWithChildren
  '/login': typeof LoginRoute
  '/post': typeof PostRoute
  '/signup': typeof SignupRoute
  '/_app/chats/$chatId': typeof AppChatsChatIdRoute
  '/_app/rooms/starred': typeof AppRoomsStarredRoute
  '/_app/users/$username': typeof AppUsersUsernameRoute
  '/_app/chats/': typeof AppChatsIndexRoute
  '/_app/marketplace/': typeof AppMarketplaceIndexRoute
  '/_app/rooms/': typeof AppRoomsIndexRoute
  '/_app/marketplace/$category/$itemId': typeof AppMarketplaceCategoryItemIdRoute
  '/_app/marketplace/$category/': typeof AppMarketplaceCategoryIndexRoute
  '/_app/rooms/$roomName/': typeof AppRoomsRoomNameIndexRoute
  '/_app/rooms/$roomName/posts/$postId': typeof AppRoomsRoomNamePostsPostIdRoute
  '/_app/rooms/$roomName/posts/': typeof AppRoomsRoomNamePostsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/login'
    | '/post'
    | '/signup'
    | '/chats/$chatId'
    | '/rooms/starred'
    | '/users/$username'
    | '/chats'
    | '/marketplace'
    | '/rooms'
    | '/marketplace/$category/$itemId'
    | '/marketplace/$category'
    | '/rooms/$roomName'
    | '/rooms/$roomName/posts/$postId'
    | '/rooms/$roomName/posts'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/login'
    | '/post'
    | '/signup'
    | '/chats/$chatId'
    | '/rooms/starred'
    | '/users/$username'
    | '/chats'
    | '/marketplace'
    | '/rooms'
    | '/marketplace/$category/$itemId'
    | '/marketplace/$category'
    | '/rooms/$roomName'
    | '/rooms/$roomName/posts/$postId'
    | '/rooms/$roomName/posts'
  id:
    | '__root__'
    | '/'
    | '/_app'
    | '/login'
    | '/post'
    | '/signup'
    | '/_app/chats/$chatId'
    | '/_app/rooms/starred'
    | '/_app/users/$username'
    | '/_app/chats/'
    | '/_app/marketplace/'
    | '/_app/rooms/'
    | '/_app/marketplace/$category/$itemId'
    | '/_app/marketplace/$category/'
    | '/_app/rooms/$roomName/'
    | '/_app/rooms/$roomName/posts/$postId'
    | '/_app/rooms/$roomName/posts/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AppRoute: typeof AppRouteWithChildren
  LoginRoute: typeof LoginRoute
  PostRoute: typeof PostRoute
  SignupRoute: typeof SignupRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AppRoute: AppRouteWithChildren,
  LoginRoute: LoginRoute,
  PostRoute: PostRoute,
  SignupRoute: SignupRoute,
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
        "/_app",
        "/login",
        "/post",
        "/signup"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_app": {
      "filePath": "_app.tsx",
      "children": [
        "/_app/chats/$chatId",
        "/_app/rooms/starred",
        "/_app/users/$username",
        "/_app/chats/",
        "/_app/marketplace/",
        "/_app/rooms/",
        "/_app/marketplace/$category/$itemId",
        "/_app/marketplace/$category/",
        "/_app/rooms/$roomName/",
        "/_app/rooms/$roomName/posts/$postId",
        "/_app/rooms/$roomName/posts/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/post": {
      "filePath": "post.tsx"
    },
    "/signup": {
      "filePath": "signup.tsx"
    },
    "/_app/chats/$chatId": {
      "filePath": "_app/chats/$chatId.tsx",
      "parent": "/_app"
    },
    "/_app/rooms/starred": {
      "filePath": "_app/rooms/starred.tsx",
      "parent": "/_app"
    },
    "/_app/users/$username": {
      "filePath": "_app/users/$username.tsx",
      "parent": "/_app"
    },
    "/_app/chats/": {
      "filePath": "_app/chats/index.tsx",
      "parent": "/_app"
    },
    "/_app/marketplace/": {
      "filePath": "_app/marketplace/index.tsx",
      "parent": "/_app"
    },
    "/_app/rooms/": {
      "filePath": "_app/rooms/index.tsx",
      "parent": "/_app"
    },
    "/_app/marketplace/$category/$itemId": {
      "filePath": "_app/marketplace/$category/$itemId.tsx",
      "parent": "/_app"
    },
    "/_app/marketplace/$category/": {
      "filePath": "_app/marketplace/$category/index.tsx",
      "parent": "/_app"
    },
    "/_app/rooms/$roomName/": {
      "filePath": "_app/rooms/$roomName/index.tsx",
      "parent": "/_app"
    },
    "/_app/rooms/$roomName/posts/$postId": {
      "filePath": "_app/rooms/$roomName/posts/$postId.tsx",
      "parent": "/_app"
    },
    "/_app/rooms/$roomName/posts/": {
      "filePath": "_app/rooms/$roomName/posts/index.tsx",
      "parent": "/_app"
    }
  }
}
ROUTE_MANIFEST_END */

import { hc } from "hono/client";
export { basicPostSchema, chatSchema, commentSchema, fullPostSchema, insertCommentSchema, insertListingSchema, insertMessageSchema, insertPostSchema, insertRoomSchema, insertUserSchema, itemConditions, listingSchema, loginValidationSchema, marketplaceCategories, messagesSchema, profileSchema, roomCategoriesArray, roomSchema, updatePasswordSchema, updateStatusSchema, userDataSchema, } from "@nexus/hono-api/schemas";
declare const client: {
    ws: import("hono/client").ClientRequest<{
        $get: {
            input: {};
            output: {};
            outputFormat: "ws";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {};
            output: {};
            outputFormat: "ws";
            status: import("hono/utils/http-status").StatusCode;
        };
    }>;
} & {
    auth: {
        login: import("hono/client").ClientRequest<{
            $post: {
                input: {
                    json: {
                        username: string;
                        password: string;
                    };
                };
                output: {
                    id: string;
                    username: string;
                    email: string | null;
                    hash: string | null;
                    avatarUrl: string;
                    oauthProvider: string | null;
                    oauthId: number | null;
                    status: string | null;
                    createdAt: string;
                };
                outputFormat: "json";
                status: 200;
            } | {
                input: {
                    json: {
                        username: string;
                        password: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 404;
            } | {
                input: {
                    json: {
                        username: string;
                        password: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 400;
            } | {
                input: {
                    json: {
                        username: string;
                        password: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    json: {
                        username: string;
                        password: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 409;
            };
        }>;
    };
} & {
    auth: {
        signup: import("hono/client").ClientRequest<{
            $post: {
                input: {
                    json: {
                        username: string;
                        email: string;
                        password: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    json: {
                        username: string;
                        email: string;
                        password: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 409;
            } | {
                input: {
                    json: {
                        username: string;
                        email: string;
                        password: string;
                    };
                };
                output: {
                    id: string;
                    username: string;
                    email: string | null;
                    hash: string | null;
                    avatarUrl: string;
                    oauthProvider: string | null;
                    oauthId: number | null;
                    status: string | null;
                    createdAt: string;
                };
                outputFormat: "json";
                status: 201;
            } | {
                input: {
                    json: {
                        username: string;
                        email: string;
                        password: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            };
        }>;
    };
} & {
    auth: {
        logout: import("hono/client").ClientRequest<{
            $post: {
                input: {};
                output: {
                    success: true;
                };
                outputFormat: "json";
                status: 200;
            } | {
                input: {};
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 401;
            };
        }>;
    };
} & {
    auth: {
        github: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {};
                outputFormat: string;
                status: 302;
            };
        }>;
    };
} & {
    auth: {
        github: {
            callback: import("hono/client").ClientRequest<{
                $get: {
                    input: {
                        query: {
                            code: string;
                            state: string;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 400;
                } | {
                    input: {
                        query: {
                            code: string;
                            state: string;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        query: {
                            code: string;
                            state: string;
                        };
                    };
                    output: {};
                    outputFormat: string;
                    status: 302;
                };
            }>;
        };
    };
} & {
    users: {
        user: import("hono/client").ClientRequest<{
            $get: {
                input: {};
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 401;
            } | {
                input: {};
                output: {
                    id: string;
                    username: string;
                    email: string | null;
                    hash: string | null;
                    avatarUrl: string;
                    oauthProvider: string | null;
                    oauthId: number | null;
                    status: string | null;
                    createdAt: string;
                    totalPosts: number;
                    subsContent: {
                        posts: {
                            id: number;
                            createdAt: string;
                            title: string;
                            text: string;
                            room: string;
                            authorId: string;
                            likesCount: number;
                            author: string;
                            isLiked: boolean;
                        }[];
                        rooms: {
                            name: string;
                            createdAt: string;
                            description: string | null;
                            creatorId: string | null;
                            category: "Pets" | "Computers" | "Gaming" | "Books" | "Movies" | "Music" | "Fitness" | "Food" | "Travel" | "Art";
                            avatar: string;
                            subsCount: number;
                            isSubscribed: boolean;
                        }[];
                        suggestedRooms: {
                            name: string;
                            createdAt: string;
                            description: string | null;
                            creatorId: string | null;
                            category: "Pets" | "Computers" | "Gaming" | "Books" | "Movies" | "Music" | "Fitness" | "Food" | "Travel" | "Art";
                            avatar: string;
                            subsCount: number;
                            isSubscribed: boolean;
                        }[];
                    };
                    totalFeedPosts: number;
                    totalLikes: number;
                    totalRoomsCreated: number;
                    totalListings: number;
                    listingsCreated: {
                        id: number;
                        createdAt: string;
                        description: string;
                        title: string;
                        category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                        sellerId: string;
                        price: number;
                        location: string;
                        sold: boolean;
                        condition: "New" | "Used" | "As new" | "Spare parts only";
                        picUrl: string;
                        seller: {
                            username: string;
                            avatarUrl: string;
                        };
                        isSaved: boolean;
                    }[];
                    listingsSaved: {
                        listing: {
                            id: number;
                            createdAt: string;
                            description: string;
                            title: string;
                            category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                            sellerId: string;
                            price: number;
                            location: string;
                            sold: boolean;
                            condition: "New" | "Used" | "As new" | "Spare parts only";
                            picUrl: string;
                            seller: {
                                username: string;
                                avatarUrl: string;
                            };
                            isSaved: boolean;
                        };
                    }[];
                    favoriteListingsCategory: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport" | null;
                    ownChats: {
                        id: number;
                        createdAt: string;
                        messages: {
                            id: number;
                            createdAt: string;
                            chatId: number;
                            senderId: string | null;
                            receiverId: string | null;
                            text: string;
                        }[];
                        contact: {
                            id: string;
                            username: string;
                            avatarUrl: string;
                        };
                        lastRead: string | null;
                    }[];
                };
                outputFormat: "json";
                status: 200;
            };
            $delete: {
                input: {};
                output: {
                    success: true;
                };
                outputFormat: "json";
                status: 200;
            } | {
                input: {};
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            };
        }>;
    };
} & {
    users: {
        ":username": import("hono/client").ClientRequest<{
            $get: {
                input: {
                    param: {
                        username: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 404;
            } | {
                input: {
                    param: {
                        username: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    param: {
                        username: string;
                    };
                };
                output: {
                    id: string;
                    username: string;
                    avatarUrl: string;
                    status: string | null;
                    createdAt: string;
                    comments: {
                        id: number;
                        createdAt: string;
                        userId: string;
                        text: string;
                        postId: number;
                        likesCount: number;
                        parentCommentId: number | null;
                        isDeleted: boolean;
                        post: {
                            id: number;
                            title: string;
                            room: {
                                name: string;
                            };
                        };
                    }[];
                    posts: {
                        id: number;
                        createdAt: string;
                        title: string;
                        text: string;
                        room: {
                            name: string;
                        };
                    }[];
                    listingsCreated: {
                        id: number;
                        createdAt: string;
                        description: string;
                        title: string;
                        category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                        sellerId: string;
                        price: number;
                        location: string;
                        sold: boolean;
                        condition: "New" | "Used" | "As new" | "Spare parts only";
                        picUrl: string;
                        seller: {
                            username: string;
                            avatarUrl: string;
                        };
                        isSaved: boolean;
                    }[];
                };
                outputFormat: "json";
                status: 200;
            };
        }>;
    };
} & {
    users: {
        avatar: import("hono/client").ClientRequest<{
            $patch: {
                input: {
                    form: {
                        avatar: File;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    form: {
                        avatar: File;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            } | {
                input: {
                    form: {
                        avatar: File;
                    };
                };
                output: {
                    newAvatarUrl: string;
                };
                outputFormat: "json";
                status: 200;
            };
        }>;
    };
} & {
    users: {
        status: import("hono/client").ClientRequest<{
            $patch: {
                input: {
                    json: {
                        status: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            } | {
                input: {
                    json: {
                        status: string;
                    };
                };
                output: {
                    newStatus: string;
                };
                outputFormat: "json";
                status: 200;
            };
        }>;
    };
} & {
    users: {
        password: import("hono/client").ClientRequest<{
            $post: {
                input: {
                    json: {
                        oldPassword: string;
                        newPassword: string;
                        passConfirm: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 400;
            } | {
                input: {
                    json: {
                        oldPassword: string;
                        newPassword: string;
                        passConfirm: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    json: {
                        oldPassword: string;
                        newPassword: string;
                        passConfirm: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            } | {
                input: {
                    json: {
                        oldPassword: string;
                        newPassword: string;
                        passConfirm: string;
                    };
                };
                output: {
                    success: true;
                };
                outputFormat: "json";
                status: 200;
            } | {
                input: {
                    json: {
                        oldPassword: string;
                        newPassword: string;
                        passConfirm: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 403;
            };
        }>;
    };
} & {
    chats: import("hono/client").ClientRequest<{
        $get: {
            input: {};
            output: {
                name: string;
                issues: {
                    code: string;
                    message: string;
                    path?: (string | number)[] | undefined;
                }[];
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {};
            output: any[] | {
                id: number;
                createdAt: string;
                messages: {
                    id: number;
                    createdAt: string;
                    chatId: number;
                    senderId: string | null;
                    receiverId: string | null;
                    text: string;
                }[];
                contact: {
                    id: string;
                    username: string;
                    avatarUrl: string;
                };
                lastRead: string | null;
            }[];
            outputFormat: "json";
            status: 200;
        };
    }>;
} & {
    chats: {
        messages: import("hono/client").ClientRequest<{
            $post: {
                input: {
                    json: {
                        receiverId: string;
                        text: string;
                        chatId?: number | undefined;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    json: {
                        receiverId: string;
                        text: string;
                        chatId?: number | undefined;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            } | {
                input: {
                    json: {
                        receiverId: string;
                        text: string;
                        chatId?: number | undefined;
                    };
                };
                output: {
                    text: string;
                } | {
                    chatId: number;
                };
                outputFormat: "json";
                status: 200;
            };
        }>;
    };
} & {
    chats: {
        ":chatId": import("hono/client").ClientRequest<{
            $get: {
                input: {
                    param: {
                        chatId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 404;
            } | {
                input: {
                    param: {
                        chatId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    param: {
                        chatId: number;
                    };
                };
                output: {
                    id: number;
                    createdAt: string;
                    messages: {
                        id: number;
                        createdAt: string;
                        chatId: number;
                        senderId: string | null;
                        receiverId: string | null;
                        text: string;
                    }[];
                    contact: {
                        id: string;
                        username: string;
                        avatarUrl: string;
                    };
                    lastRead: string | null;
                };
                outputFormat: "json";
                status: 200;
            };
            $delete: {
                input: {
                    param: {
                        chatId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    param: {
                        chatId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            } | {
                input: {
                    param: {
                        chatId: number;
                    };
                };
                output: {
                    success: true;
                };
                outputFormat: "json";
                status: 200;
            };
        }>;
    };
} & {
    rooms: import("hono/client").ClientRequest<{
        $post: {
            input: {
                form: {
                    name: string;
                    description: string;
                    category: "Pets" | "Computers" | "Gaming" | "Books" | "Movies" | "Music" | "Fitness" | "Food" | "Travel" | "Art";
                    avatar?: File | undefined;
                };
            };
            output: {
                name: string;
                issues: {
                    code: string;
                    path: (string | number)[];
                    message?: string | undefined;
                }[];
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                form: {
                    name: string;
                    description: string;
                    category: "Pets" | "Computers" | "Gaming" | "Books" | "Movies" | "Music" | "Fitness" | "Food" | "Travel" | "Art";
                    avatar?: File | undefined;
                };
            };
            output: {
                name: string;
                issues: {
                    code: string;
                    message: string;
                    path?: (string | number)[] | undefined;
                }[];
            };
            outputFormat: "json";
            status: 409;
        } | {
            input: {
                form: {
                    name: string;
                    description: string;
                    category: "Pets" | "Computers" | "Gaming" | "Books" | "Movies" | "Music" | "Fitness" | "Food" | "Travel" | "Art";
                    avatar?: File | undefined;
                };
            };
            output: {
                name: string;
                createdAt: string;
                description: string | null;
                creatorId: string | null;
                category: "Pets" | "Computers" | "Gaming" | "Books" | "Movies" | "Music" | "Fitness" | "Food" | "Travel" | "Art";
                avatar: string;
                subsCount: number;
                isSubscribed: boolean;
            };
            outputFormat: "json";
            status: 200;
        };
    }>;
} & {
    rooms: {
        ":roomName": {
            subscriptions: import("hono/client").ClientRequest<{
                $patch: {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        query: {
                            action: "add" | "remove";
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        query: {
                            action: "add" | "remove";
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 500;
                } | {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        query: {
                            action: "add" | "remove";
                        };
                    };
                    output: {
                        success: true;
                    };
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
} & {
    rooms: {
        ":roomName": {
            posts: import("hono/client").ClientRequest<{
                $get: {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        query: {
                            orderBy?: "createdAt" | "likesCount" | undefined;
                            cursorTime?: string | undefined;
                            cursorLikes?: number | undefined;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 404;
                } | {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        query: {
                            orderBy?: "createdAt" | "likesCount" | undefined;
                            cursorTime?: string | undefined;
                            cursorLikes?: number | undefined;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        query: {
                            orderBy?: "createdAt" | "likesCount" | undefined;
                            cursorTime?: string | undefined;
                            cursorLikes?: number | undefined;
                        };
                    };
                    output: {
                        name: string;
                        createdAt: string;
                        description: string | null;
                        posts: {
                            id: number;
                            createdAt: string;
                            title: string;
                            text: string;
                            room: string;
                            authorId: string;
                            likesCount: number;
                            author: string;
                            isLiked: boolean;
                        }[];
                        creatorId: string | null;
                        category: "Pets" | "Computers" | "Gaming" | "Books" | "Movies" | "Music" | "Fitness" | "Food" | "Travel" | "Art";
                        avatar: string;
                        subsCount: number;
                        isSubscribed: boolean;
                        totalPosts: number;
                    };
                    outputFormat: "json";
                    status: 200;
                };
                $post: {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        json: {
                            title: string;
                            text: string;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        json: {
                            title: string;
                            text: string;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 500;
                } | {
                    input: {
                        param: {
                            roomName: string;
                        };
                    } & {
                        json: {
                            title: string;
                            text: string;
                        };
                    };
                    output: {
                        id: number;
                        createdAt: string;
                        title: string;
                        text: string;
                        room: string;
                        authorId: string;
                        likesCount: number;
                        author: string;
                        isLiked: boolean;
                    };
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
} & {
    rooms: {
        ":roomName": import("hono/client").ClientRequest<{
            $delete: {
                input: {
                    param: {
                        roomName: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    param: {
                        roomName: string;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            } | {
                input: {
                    param: {
                        roomName: string;
                    };
                };
                output: {
                    success: true;
                };
                outputFormat: "json";
                status: 200;
            };
        }>;
    };
} & {
    posts: {
        ":postId": import("hono/client").ClientRequest<{
            $get: {
                input: {
                    param: {
                        postId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 404;
            } | {
                input: {
                    param: {
                        postId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    param: {
                        postId: number;
                    };
                };
                output: {
                    id: number;
                    createdAt: string;
                    title: string;
                    text: string;
                    comments: {
                        id: number;
                        createdAt: string;
                        userId: string;
                        text: string;
                        postId: number;
                        likesCount: number;
                        parentCommentId: number | null;
                        isDeleted: boolean;
                        author: {
                            username: string;
                            avatarUrl: string;
                        };
                        isLiked: boolean;
                    }[];
                    room: {
                        name: string;
                        createdAt: string;
                        description: string | null;
                        creatorId: string | null;
                        category: "Pets" | "Computers" | "Gaming" | "Books" | "Movies" | "Music" | "Fitness" | "Food" | "Travel" | "Art";
                        avatar: string;
                        subsCount: number;
                        isSubscribed: boolean;
                    };
                    authorId: string;
                    likesCount: number;
                    author: string;
                    isLiked: boolean;
                };
                outputFormat: "json";
                status: 200;
            };
        }>;
    };
} & {
    posts: {
        ":postId": {
            likes: import("hono/client").ClientRequest<{
                $patch: {
                    input: {
                        param: {
                            postId: number;
                        };
                    } & {
                        query: {
                            action: "add" | "remove";
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        param: {
                            postId: number;
                        };
                    } & {
                        query: {
                            action: "add" | "remove";
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 500;
                } | {
                    input: {
                        param: {
                            postId: number;
                        };
                    } & {
                        query: {
                            action: "add" | "remove";
                        };
                    };
                    output: {
                        success: true;
                    };
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
} & {
    posts: {
        feed: {
            data: import("hono/client").ClientRequest<{
                $get: {
                    input: {
                        query: {
                            cursorTime: string;
                            cursorLikes: number;
                            orderBy?: "createdAt" | "likesCount" | undefined;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        query: {
                            cursorTime: string;
                            cursorLikes: number;
                            orderBy?: "createdAt" | "likesCount" | undefined;
                        };
                    };
                    output: {
                        id: number;
                        createdAt: string;
                        title: string;
                        text: string;
                        room: string;
                        authorId: string;
                        likesCount: number;
                        author: string;
                        isLiked: boolean;
                    }[];
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
} & {
    posts: {
        ":postId": {
            comments: import("hono/client").ClientRequest<{
                $post: {
                    input: {
                        param: {
                            postId: number;
                        };
                    } & {
                        json: {
                            text: string;
                            parentCommentId?: number | undefined;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        param: {
                            postId: number;
                        };
                    } & {
                        json: {
                            text: string;
                            parentCommentId?: number | undefined;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 500;
                } | {
                    input: {
                        param: {
                            postId: number;
                        };
                    } & {
                        json: {
                            text: string;
                            parentCommentId?: number | undefined;
                        };
                    };
                    output: {
                        id: number;
                        createdAt: string;
                        userId: string;
                        text: string;
                        postId: number;
                        likesCount: number;
                        parentCommentId: number | null;
                        isDeleted: boolean;
                        author: {
                            username: string;
                            avatarUrl: string;
                        };
                        isLiked: boolean;
                    };
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
} & {
    posts: {
        comments: {
            ":commentId": {
                likes: import("hono/client").ClientRequest<{
                    $patch: {
                        input: {
                            param: {
                                commentId: number;
                            };
                        } & {
                            query: {
                                action: "add" | "remove";
                            };
                        };
                        output: {
                            name: string;
                            issues: {
                                code: string;
                                path: (string | number)[];
                                message?: string | undefined;
                            }[];
                        };
                        outputFormat: "json";
                        status: 422;
                    } | {
                        input: {
                            param: {
                                commentId: number;
                            };
                        } & {
                            query: {
                                action: "add" | "remove";
                            };
                        };
                        output: {
                            name: string;
                            issues: {
                                code: string;
                                message: string;
                                path?: (string | number)[] | undefined;
                            }[];
                        };
                        outputFormat: "json";
                        status: 500;
                    } | {
                        input: {
                            param: {
                                commentId: number;
                            };
                        } & {
                            query: {
                                action: "add" | "remove";
                            };
                        };
                        output: {
                            success: true;
                        };
                        outputFormat: "json";
                        status: 200;
                    };
                }>;
            };
        };
    };
} & {
    posts: {
        comments: {
            ":commentId": import("hono/client").ClientRequest<{
                $delete: {
                    input: {
                        param: {
                            commentId: number;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        param: {
                            commentId: number;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 500;
                } | {
                    input: {
                        param: {
                            commentId: number;
                        };
                    };
                    output: {
                        success: true;
                    };
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
} & {
    listings: import("hono/client").ClientRequest<{
        $post: {
            input: {
                form: {
                    description: string;
                    title: string;
                    category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                    price: number;
                    location: string;
                    condition: "New" | "Used" | "As new" | "Spare parts only";
                    pic?: File | undefined;
                };
            };
            output: {
                name: string;
                issues: {
                    code: string;
                    path: (string | number)[];
                    message?: string | undefined;
                }[];
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                form: {
                    description: string;
                    title: string;
                    category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                    price: number;
                    location: string;
                    condition: "New" | "Used" | "As new" | "Spare parts only";
                    pic?: File | undefined;
                };
            };
            output: {
                name: string;
                issues: {
                    code: string;
                    message: string;
                    path?: (string | number)[] | undefined;
                }[];
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                form: {
                    description: string;
                    title: string;
                    category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                    price: number;
                    location: string;
                    condition: "New" | "Used" | "As new" | "Spare parts only";
                    pic?: File | undefined;
                };
            };
            output: {
                id: number;
                createdAt: string;
                description: string;
                title: string;
                category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                sellerId: string;
                price: number;
                location: string;
                sold: boolean;
                condition: "New" | "Used" | "As new" | "Spare parts only";
                picUrl: string;
                seller: {
                    username: string;
                    avatarUrl: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                    orderBy: "cheapest" | "mostRecent";
                };
            };
            output: {
                name: string;
                issues: {
                    code: string;
                    path: (string | number)[];
                    message?: string | undefined;
                }[];
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                query: {
                    category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                    orderBy: "cheapest" | "mostRecent";
                };
            };
            output: {
                id: number;
                createdAt: string;
                description: string;
                title: string;
                category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                sellerId: string;
                price: number;
                location: string;
                sold: boolean;
                condition: "New" | "Used" | "As new" | "Spare parts only";
                picUrl: string;
                seller: {
                    username: string;
                    avatarUrl: string;
                };
                isSaved: boolean;
            }[];
            outputFormat: "json";
            status: 200;
        };
    }>;
} & {
    listings: {
        ":itemId": import("hono/client").ClientRequest<{
            $get: {
                input: {
                    param: {
                        itemId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 404;
            } | {
                input: {
                    param: {
                        itemId: number;
                    };
                };
                output: {
                    id: number;
                    createdAt: string;
                    description: string;
                    title: string;
                    category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                    sellerId: string;
                    price: number;
                    location: string;
                    sold: boolean;
                    condition: "New" | "Used" | "As new" | "Spare parts only";
                    picUrl: string;
                    seller: {
                        username: string;
                        avatarUrl: string;
                    };
                    isSaved: boolean;
                };
                outputFormat: "json";
                status: 200;
            };
            $delete: {
                input: {
                    param: {
                        listingId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        path: (string | number)[];
                        message?: string | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 422;
            } | {
                input: {
                    param: {
                        listingId: number;
                    };
                };
                output: {
                    name: string;
                    issues: {
                        code: string;
                        message: string;
                        path?: (string | number)[] | undefined;
                    }[];
                };
                outputFormat: "json";
                status: 500;
            } | {
                input: {
                    param: {
                        listingId: number;
                    };
                };
                output: {
                    success: true;
                };
                outputFormat: "json";
                status: 200;
            };
        }>;
    };
} & {
    listings: {
        ":itemId": {
            save: import("hono/client").ClientRequest<{
                $patch: {
                    input: {
                        param: {
                            itemId: number;
                        };
                    } & {
                        query: {
                            action: "add" | "remove";
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 500;
                } | {
                    input: {
                        param: {
                            itemId: number;
                        };
                    } & {
                        query: {
                            action: "add" | "remove";
                        };
                    };
                    output: {
                        success: true;
                    };
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
} & {
    listings: {
        suggested: {
            data: import("hono/client").ClientRequest<{
                $get: {
                    input: {
                        query: {
                            category?: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport" | undefined;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        query: {
                            category?: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport" | undefined;
                        };
                    };
                    output: {
                        id: number;
                        createdAt: string;
                        description: string;
                        title: string;
                        category: "Books" | "Technology" | "Motors" | "Clothing" | "Collectibles" | "Sport";
                        sellerId: string;
                        price: number;
                        location: string;
                        sold: boolean;
                        condition: "New" | "Used" | "As new" | "Spare parts only";
                        picUrl: string;
                        seller: {
                            username: string;
                            avatarUrl: string;
                        };
                        isSaved: boolean;
                    }[];
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
} & {
    listings: {
        ":itemId": {
            sold: import("hono/client").ClientRequest<{
                $patch: {
                    input: {
                        param: {
                            itemId: number;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            path: (string | number)[];
                            message?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 422;
                } | {
                    input: {
                        param: {
                            itemId: number;
                        };
                    };
                    output: {
                        name: string;
                        issues: {
                            code: string;
                            message: string;
                            path?: (string | number)[] | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: 500;
                } | {
                    input: {
                        param: {
                            itemId: number;
                        };
                    };
                    output: {
                        success: true;
                    };
                    outputFormat: "json";
                    status: 200;
                };
            }>;
        };
    };
};
export type Client = typeof client;
declare const _default: (baseUrl: string, options?: import("hono").ClientRequestOptions | undefined) => Client;
export default _default;
//# sourceMappingURL=index.d.ts.map
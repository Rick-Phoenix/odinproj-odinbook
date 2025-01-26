import RPC from "@nexus/shared-schemas";

export const api = RPC("/api");
const chat = await api.chats[":chatId"].$get({ param: { chatId: 1 } });
const chatdata = await chat.json();
console.log(chat);

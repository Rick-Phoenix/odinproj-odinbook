import type { Hono } from "hono";
import type { ClientRequestOptions } from "hono/client";
import { hc } from "hono/client";
import type { UnionToIntersection } from "hono/utils/types";
import type { Client } from "/home/rick/nexus/node_modules/.pnpm/hono@4.6.15/node_modules/hono/dist/types/client/types.d.ts";

type Callback = (opts: CallbackOptions) => unknown;
interface CallbackOptions {
  path: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
}

const createProxy = (callback: Callback, path: string[]) => {
  const proxy: unknown = new Proxy(() => {}, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      return createProxy(callback, [...path, prop]);
    },
    apply(target, thisArg, args) {
      return callback({
        path,
        args,
      });
    },
  });
  return proxy;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hcs = <T extends Hono<any, any, any>>(
  baseUrl: string,
  options?: ClientRequestOptions
) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  createProxy(async ({ path, args }) => {
    let client = hc<T>(baseUrl, options);

    for (const part of path) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      client = client[part];
    }

    const res: Response = client(...args);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument

    // if (res.headers.get("x-superjson") === "true") {
    //   res.json = async () => {
    //     const text = await res.text();
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    //     return superjson.parse<schematype>(text);
    //   };
    // }

    return res;
  }, []) as UnionToIntersection<Client<T>>;

// const test = hcs<ApiRoutes>("http:localhost:3000/api");

// const bar = await test.chats[":chatId"].$get({ param: { chatId: 1 } });

// const baz = await bar.text();
// console.log("🚀 ~ file: _customhc.ts:68 ~ baz:", baz);

// const baz2 = SuperJSON.parse<chat>(baz);
// console.log("🚀 ~ file: _customhc.ts:75 ~ baz2:", baz2);

// type chat = z.infer<typeof chatSchema>;

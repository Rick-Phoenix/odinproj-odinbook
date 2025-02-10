import { MessageCircleMore } from "lucide-react";
import { Fragment, type FC } from "react";
import { PiThumbsUpBold } from "react-icons/pi";
import {
  CommentButton,
  LikeButton,
  ShareButton,
} from "../components/custom/buttons";
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import type { PostFull } from "../lib/api-client";

interface Comment {
  text: string;
  sub?: Comments;
}

type Comments = Comment[];

const comments: Comments = [
  { text: " base 1", sub: [{ text: "1- 1" }] },
  { text: " 2" },
  { text: " 3" },
  {
    text: " 4",
    sub: [
      {
        text: " 4-1",
        sub: [
          {
            text: "4-2",
            sub: [
              {
                text: "4-3",
                sub: [
                  {
                    text: "4-4",
                    sub: [
                      {
                        text: "4-5",
                        sub: [
                          {
                            text: `Culpa quis sit aliquip et nostrud adipisicing. Anim tempor esse ut excepteur in ad velit cillum voluptate eiusmod. Non dolore velit est cupidatat elit nostrud ut magna magna. Ad laboris deserunt pariatur ut mollit consectetur ullamco esse labore. Occaecat aute pariatur sunt aliquip ea. Culpa est nulla nulla enim reprehenderit dolor eu.

Velit excepteur velit mollit ea enim laborum. Consectetur laborum veniam cillum do amet fugiat. Deserunt cillum est exercitation in duis. Veniam aute culpa dolore cillum excepteur. Consectetur non dolor in veniam reprehenderit exercitation et nostrud ad irure in aliqua. Ex aute cupidatat non excepteur ut do dolore consequat dolore deserunt exercitation excepteur cillum. Nostrud sunt esse reprehenderit voluptate aute proident fugiat minim eiusmod culpa cupidatat.`,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    text: " 5",
    sub: [{ text: "5-1" }, { text: " 5-2", sub: [{ text: "5-3" }] }],
  },
  {
    text: `Occaecat commodo enim elit mollit incididunt ipsum non aute aliqua nostrud ut nostrud commodo. Ullamco duis eiusmod sint consectetur anim aliqua et ut. Ipsum est aliqua pariatur velit ad officia ad laborum cupidatat. Cupidatat consectetur nostrud duis officia ut. Occaecat qui ipsum ad excepteur qui ipsum.

Est duis excepteur reprehenderit non quis pariatur id minim cupidatat velit. Id et cupidatat occaecat cillum irure id nostrud enim et minim qui mollit. Esse excepteur velit ex quis aliqua nisi exercitation aliquip nisi sunt. Culpa duis commodo dolore duis mollit consequat. Mollit mollit cillum Lorem laborum irure incididunt reprehenderit fugiat et cupidatat. Ea sunt sunt ad do aliquip cupidatat. Ea sunt incididunt laboris elit commodo laborum consectetur excepteur consectetur laboris dolor officia aliquip.`,
  },
];

function renderComments(
  comments: Comments,
  startingRow: number,
  startingColumn: number,
) {
  return comments.map((c, i) => {
    const row = startingRow + i;
    const children = c?.sub;
    const gridClassName = `col-start-${startingColumn} row-start-${row} grid grid-cols-[auto_1fr] items-center ${startingColumn !== 1 || row !== 1 ? "pt-8" : " "} ${startingColumn === 1 ? "col-end-3" : " "}`;
    let separatorRowEnd = children ? children.length + 3 : 3;
    if (startingColumn > 1) separatorRowEnd--;
    const separatorRowEndClass = `row-end-${separatorRowEnd}`;
    const separatorHeight =
      i === comments.length - 1 && !children
        ? "min-h-0"
        : "min-h-[calc(100%+4.5rem)]";
    const separatorClass = `col-start-1 row-start-2 ${separatorRowEndClass} ${separatorHeight} justify-self-center`;
    return (
      // Change to comment Id once db is up
      <Fragment key={i}>
        <div className={gridClassName}>
          <div
            className={`relative col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground`}
          >
            {startingColumn > 1 && (
              <span className="absolute -left-[1.27rem] top-[calc(-50%+1rem)] h-6 w-5 rounded-xl rounded-r-none rounded-t-none border-b border-l bg-transparent" />
            )}
          </div>
          <div className="col-start-2 row-start-1 flex flex-col pl-4">
            <div className="flex gap-4">
              <div>Nickname</div>
              <div>Sent At</div>
            </div>
            <div>Role</div>
          </div>

          <Separator orientation="vertical" className={separatorClass} />

          <div className="col-start-2 row-start-2 flex flex-col gap-2 pl-4 pt-4">
            <div>{c.text}</div>
            <div className="flex items-center gap-2">
              <PiThumbsUpBold /> <MessageCircleMore />
            </div>
          </div>

          {children && renderComments(children, 3, 2)}
        </div>
      </Fragment>
    );
  });
}

const Post: FC<{ post: PostFull }> = ({ post }) => {
  return (
    <section className="min-h-svh overflow-x-auto rounded-xl bg-muted/50">
      <CardHeader>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">{post.text}</CardContent>
      <Separator className="mt-1" />
      <div className="flex p-3">
        <LikeButton postId={post.id} />
        <CommentButton roomName={post.room.name} postId={post.id} />
        <ShareButton />
      </div>
      <Separator className="mt-1" />
      <div className="my-4 p-6">
        <Input placeholder="Write a comment..." />
      </div>
      <Separator className="mt-1" />

      <div className="p-6">
        <div className="py-6">Comments</div>
        <div className="grid grid-cols-[2.5rem_1fr] items-center">
          {renderComments(comments, 1, 1)}
        </div>
      </div>
    </section>
  );
};

export default Post;

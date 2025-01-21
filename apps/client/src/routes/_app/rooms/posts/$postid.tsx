import { createFileRoute } from "@tanstack/react-router";
import { MessageCircleMore, Share } from "lucide-react";
import { useState } from "react";
import { PiThumbsUpBold, PiThumbsUpFill } from "react-icons/pi";
import ButtonGesture from "../../../../components/motion/gestures";
import { Button } from "../../../../components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";

export const Route = createFileRoute("/_app/rooms/posts/$postid")({
  component: RouteComponent,
});

const comments = [
  { text: " comment text", sub: [{ text: "comment text" }] },
  { text: " comment text" },
  { text: " comment text" },
  {
    text: " comment text",
    sub: {
      text: " comment text",
      sub: { text: " comment text", sub: [{ text: "comment text" }] },
    },
  },
  ,
  {
    text: " comment text",
    sub: [
      { text: "comment text" },
      { text: " comment text", sub: [{ text: "comment text" }] },
    ],
  },
];

function RouteComponent() {
  return (
    <section className="min-h-svh rounded-xl bg-muted/50">
      <CardHeader>
        <CardTitle className="text-2xl">
          Voluptate laboris excepteur incididunt dolor aliqua. Sint fugiat culpa
          ad dolore proident labore est cupidatat commodo in enim deserunt.
          Adipisicing qui reprehenderit ad minim culpa eiusmod excepteur. Labore
          ipsum dolor deserunt est Lorem duis. Dolor ut excepteur laborum ipsum
          magna dolore anim pariatur deserunt mollit ad in. Proident nostrud qui
          mollit mollit. Ex mollit irure veniam voluptate mollit id mollit
          consequat. Cupidatat aute et reprehenderit sint est anim. Cillum
          pariatur ipsum culpa nulla sit cupidatat velit veniam consectetur
          dolor excepteur est sint. Cillum minim in fugiat pariatur eu labore
          laboris sit elit anim mollit.
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        Sit nulla do Lorem amet commodo culpa. In incididunt pariatur nulla
        reprehenderit officia minim mollit proident eu. Ut mollit officia id
        velit cillum amet dolor cupidatat. Commodo eu aute qui et occaecat
        occaecat culpa minim Lorem cillum. Labore ut qui adipisicing ut commodo
        minim. Pariatur enim ad incididunt veniam consequat eu tempor. Irure
        occaecat culpa pariatur exercitation. Sint irure esse et cillum culpa
        consequat qui consequat occaecat commodo reprehenderit. Velit labore eu
        aliquip est ipsum sunt commodo enim elit cupidatat consequat ullamco
        ullamco. Elit ipsum Lorem consectetur anim labore sunt cupidatat sint.
        Et sint dolor in ipsum voluptate. Sit adipisicing aliqua laboris eu in
        ut sit quis et sunt nisi. Officia nisi sit adipisicing non quis amet
        esse. Nulla incididunt dolor ea aliqua.
      </CardContent>
      <Separator className="mt-1" />
      <div className="flex p-3">
        <LikeButton />
        <CommentButton />
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
          {comments.map((comment, i) => {
            const previousCommentHadChildren =
              i > 0 && comments[i - 1]?.sub ? true : false;
            const currentCommentHasChildren = comments[i]?.sub || false;
            const childrenCommentHasChildren =
              Array.isArray(comments[i]?.sub) &&
              comments[i].sub.some((comment) => {
                return comment?.sub;
              });
            const gridOrder = previousCommentHadChildren ? i + 2 : i + 1;
            return (
              <>
                <div
                  key={i}
                  className={`col-start-1 col-end-3 row-start-${gridOrder} grid grid-cols-[auto_1fr] items-center justify-self-start`}
                >
                  <div className="col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground"></div>
                  <div className="col-start-2 row-start-1 flex flex-col pl-4">
                    <div className="flex gap-4">
                      <div>Nickname</div>
                      <div>Sent At</div>
                    </div>
                    <div>Role</div>
                  </div>
                  <Separator
                    orientation="vertical"
                    className={`col-start-1 row-start-2 h-full justify-self-center`}
                  />
                  <div
                    className={`col-start-2 row-start-2 flex flex-col gap-2 pl-4 pt-4`}
                  >
                    <div>Comment text</div>
                    <div className="flex items-center gap-2">
                      <PiThumbsUpBold /> <MessageCircleMore />
                    </div>
                  </div>
                </div>
                {currentCommentHasChildren ? (
                  <>
                    <Separator
                      orientation="vertical"
                      className={`row-start-${gridOrder + 1} justify-self-center`}
                    />

                    <div
                      className={`col-start-2 row-start-${gridOrder + 1} grid grid-cols-[auto_1fr] items-center pt-4`}
                    >
                      <div className="relative col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground">
                        <span className="absolute -left-5 top-2 h-3 w-5 rounded-xl rounded-r-none rounded-t-none border-b border-l bg-transparent hover:border-b-white hover:border-l-white" />
                      </div>
                      <div className="col-start-2 row-start-1 flex flex-col pl-4">
                        <div className="flex gap-4">
                          <div>Nickname</div>
                          <div>Sent At</div>
                        </div>
                        <div>Role</div>
                      </div>

                      {childrenCommentHasChildren && (
                        <Separator
                          orientation="vertical"
                          className="col-start-1 row-start-2 h-full justify-self-center"
                        />
                      )}

                      <div className="col-start-2 row-start-2 flex flex-col gap-2 pl-4 pt-4">
                        <div>Comment text</div>
                        <div className="flex items-center gap-2">
                          <PiThumbsUpBold /> <MessageCircleMore />
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            );
          })}
          {/* <div className="col-start-1 col-end-3 row-start-1 grid grid-cols-[auto_1fr] items-center justify-self-start">
            <div className="col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground"></div>
            <div className="col-start-2 row-start-1 flex flex-col pl-4">
              <div className="flex gap-4">
                <div>Nickname</div>
                <div>Sent At</div>
              </div>
              <div>Role</div>
            </div>
            <Separator
              orientation="vertical"
              className="col-start-1 row-start-2 h-full justify-self-center"
            />
            <div className="col-start-2 row-start-2 flex flex-col gap-2 pl-4 pt-4">
              <div>Comment text</div>
              <div className="flex items-center gap-2">
                <PiThumbsUpBold /> <MessageCircleMore />
              </div>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="row-start-2 justify-self-center"
          />

          <div className="col-start-2 row-start-2 grid grid-cols-[auto_1fr] items-center pt-4">
            <div className="relative col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground">
              <span className="absolute -left-5 top-2 h-3 w-5 rounded-xl rounded-r-none rounded-t-none border-b border-l bg-transparent hover:border-b-white hover:border-l-white" />
            </div>
            <div className="col-start-2 row-start-1 flex flex-col pl-4">
              <div className="flex gap-4">
                <div>Nickname</div>
                <div>Sent At</div>
              </div>
              <div>Role</div>
            </div>

            <Separator
              orientation="vertical"
              className="col-start-1 row-start-2 h-full justify-self-center"
            />

            <div className="col-start-2 row-start-2 flex flex-col gap-2 pl-4 pt-4">
              <div>Comment text</div>
              <div className="flex items-center gap-2">
                <PiThumbsUpBold /> <MessageCircleMore />
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="row-start-3 justify-self-center"
            />

            <div className="col-start-2 row-start-3 grid grid-cols-[auto_1fr] items-center gap-x-4 justify-self-start pt-4">
              <div className="relative col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground">
                <span className="absolute -left-5 top-2 h-3 w-5 rounded-xl rounded-r-none rounded-t-none border-b border-l bg-transparent hover:border-b-white hover:border-l-white" />
              </div>
              <div className="col-start-2 row-start-1 flex flex-col pl-4">
                <div className="flex gap-4">
                  <div>Nickname</div>
                  <div>Sent At</div>
                </div>
                <div>Role</div>
              </div>

              <Separator
                orientation="vertical"
                className="col-start-1 row-start-2 h-full justify-self-center"
              />

              <div className="col-start-2 row-start-2 flex flex-col gap-2 pl-4 pt-4">
                <div>Comment text</div>
                <div className="flex items-center gap-2">
                  <PiThumbsUpBold /> <MessageCircleMore />
                </div>
              </div>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="row-start-3 justify-self-center"
          />

          <div className="col-start-2 row-start-3 grid grid-cols-[auto_1fr] items-center gap-x-4 justify-self-start pt-4">
            <div className="relative col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground">
              <span className="absolute -left-5 top-2 h-3 w-5 rounded-xl rounded-r-none rounded-t-none border-b border-l bg-transparent hover:border-b-white hover:border-l-white" />
            </div>
            <div className="col-start-2 row-start-1 flex flex-col pl-4">
              <div className="flex gap-4">
                <div>Nickname</div>
                <div>Sent At</div>
              </div>
              <div>Role</div>
            </div>

            <Separator
              orientation="vertical"
              className="col-start-1 row-start-2 h-full justify-self-center"
            />

            <div className="col-start-2 row-start-2 flex flex-col gap-2 pl-4 pt-4">
              <div>Comment text</div>
              <div className="flex items-center gap-2">
                <PiThumbsUpBold /> <MessageCircleMore />
              </div>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="row-start-4 justify-self-center"
          />

          <div className="col-start-2 row-start-4 grid grid-cols-[auto_1fr] items-center gap-x-4 justify-self-start pt-4">
            <div className="relative col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground">
              <span className="absolute -left-5 top-2 h-3 w-5 rounded-xl rounded-r-none rounded-t-none border-b border-l bg-transparent hover:border-b-white hover:border-l-white" />
            </div>
            <div className="col-start-2 row-start-1 flex flex-col pl-4">
              <div className="flex gap-4">
                <div>Nickname</div>
                <div>Sent At</div>
              </div>
              <div>Role</div>
            </div>

            <Separator
              orientation="vertical"
              className="col-start-1 row-start-2 h-full justify-self-center"
            />

            <div className="col-start-2 row-start-2 flex flex-col gap-2 pl-4 pt-4">
              <div>Comment text</div>
              <div className="flex items-center gap-2">
                <PiThumbsUpBold /> <MessageCircleMore />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

function ShareButton() {
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6">
      <ButtonGesture>
        <Share />
        Share
      </ButtonGesture>
    </Button>
  );
}

function CommentButton() {
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6">
      <ButtonGesture>
        <MessageCircleMore />
        Comment
      </ButtonGesture>
    </Button>
  );
}

function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <Button
      asChild
      variant={"ghost"}
      onClick={() => {
        setIsLiked(!isLiked);
      }}
      className="w-full flex-1 justify-center p-6"
    >
      <ButtonGesture>
        {isLiked ? <PiThumbsUpFill /> : <PiThumbsUpBold />}
        Like
      </ButtonGesture>
    </Button>
  );
}

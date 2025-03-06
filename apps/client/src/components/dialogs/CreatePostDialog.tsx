import { Plus } from "lucide-react";
import { lazy, Suspense, useMemo, useState, type FC } from "react";
import Spinner from "../custom-ui-blocks/Spinner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const DialogContentLazy = lazy(() => import("./CreatePostDialogForm"));

const CreatePostDialog: FC<{ roomName: string }> = ({ roomName }) => {
  const [open, setOpen] = useState(false);
  const DialogContentMemo = useMemo(() => DialogContentLazy, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-4 rounded-md">
          <Plus /> New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Make a new contribution to this community.</DialogDescription>
        </DialogHeader>
        <Suspense fallback={<Spinner />}>
          {open && <DialogContentMemo setOpen={setOpen} roomName={roomName} />}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;

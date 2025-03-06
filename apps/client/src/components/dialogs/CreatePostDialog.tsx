import { Plus } from "lucide-react";
import { useState, type FC } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreatePostDialogForm from "./CreatePostDialogForm";

const CreatePostDialog: FC<{ roomName: string }> = ({ roomName }) => {
  const [open, setOpen] = useState(false);

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
        <CreatePostDialogForm setOpen={setOpen} roomName={roomName} />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;

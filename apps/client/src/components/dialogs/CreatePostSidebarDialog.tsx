import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SidebarMenuSubButton } from "../ui/sidebar";
import CreatePostSidebarDialogForm from "./CreatePostSidebarDialogForm";

const CreatePostSidebarDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuSubButton asChild className="w-full cursor-pointer">
          <DialogTrigger>Create Post</DialogTrigger>
        </SidebarMenuSubButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Make a new contribution to this community.</DialogDescription>
        </DialogHeader>
        <CreatePostSidebarDialogForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostSidebarDialog;

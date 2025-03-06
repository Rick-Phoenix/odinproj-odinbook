import { useState, type FC, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import CreateChatDialogForm from "./CreateChatDialogForm";

const CreateChatDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Create Chat</DialogTitle>
        </DialogHeader>
        <CreateChatDialogForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatDialog;

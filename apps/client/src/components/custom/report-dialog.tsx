import type { ReactNode } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const ReportDialog: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Are you sure you want to report this user?
          </DialogTitle>
        </DialogHeader>
        <div className="mt-3 flex w-full justify-center gap-3">
          <DialogClose asChild>
            <Button size={"lg"}>Cancel</Button>
          </DialogClose>
          <Button variant={"destructive"} size={"lg"}>
            Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;

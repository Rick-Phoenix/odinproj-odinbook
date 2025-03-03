import { lazy, Suspense, useMemo, useState, type FC, type ReactNode } from "react";
import Spinner from "../custom-ui-blocks/Spinner";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

const DialogContentLazy = lazy(() => import("./CreateChatDialogForm"));

const CreateChatDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const DialogContentMemo = useMemo(() => DialogContentLazy, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Suspense fallback={<Spinner />}>
          {open && <DialogContentMemo setOpen={setOpen} />}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatDialog;

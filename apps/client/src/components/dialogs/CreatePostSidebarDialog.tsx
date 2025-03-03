import { lazy, Suspense, useMemo, useState } from "react";
import Spinner from "../custom-ui-blocks/Spinner";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { SidebarMenuSubButton } from "../ui/sidebar";

const DialogContentLazy = lazy(() => import("./CreatePostSidebarDialogForm"));

const CreatePostSidebarDialog = () => {
  const [open, setOpen] = useState(false);
  const DialogContentMemo = useMemo(() => DialogContentLazy, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuSubButton asChild className="w-full cursor-pointer">
          <DialogTrigger>Create Post</DialogTrigger>
        </SidebarMenuSubButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Suspense fallback={<Spinner />}>
          {open && <DialogContentMemo setOpen={setOpen} />}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostSidebarDialog;

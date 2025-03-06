import { HandCoins } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import Spinner from "../custom-ui-blocks/Spinner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

const DialogContentLazy = lazy(() => import("./CreateListingDialogForm"));

const CreateListingDialog = () => {
  const [open, setOpen] = useState(false);
  const DialogContentMemo = useMemo(() => DialogContentLazy, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="size-full justify-between text-2xl [&_svg]:size-12">
          Sell An Item <HandCoins />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new listing</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<Spinner />}>{open && <DialogContentMemo />}</Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingDialog;

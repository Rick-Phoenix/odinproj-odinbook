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
import { SidebarMenuSubButton } from "../ui/sidebar";

const DialogContentLazy = lazy(() => import("./CreateRoomDialogForm"));

const CreateRoomDialog: FC<{ inSidebar?: boolean }> = ({ inSidebar }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const DialogContentMemo = useMemo(() => DialogContentLazy, []);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {inSidebar ? (
        <SidebarMenuSubButton asChild className="w-full cursor-pointer">
          <DialogTrigger onClick={handleDialogOpen}>Create Room</DialogTrigger>
        </SidebarMenuSubButton>
      ) : (
        <Button size={"lg"} asChild className="h-12 w-full cursor-pointer">
          <DialogTrigger onClick={handleDialogOpen}>Create Room</DialogTrigger>
        </Button>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Room</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Rooms are spaces where you can share your ideas and passions with other members of the
          community.
        </DialogDescription>
        <Suspense fallback={<Spinner />}>{isDialogOpen && <DialogContentMemo />}</Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;

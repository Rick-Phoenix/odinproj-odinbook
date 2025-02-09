import { useParams } from "@tanstack/react-router";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "../../ui/table";

const MarketplaceSidebarContent = () => {
  const { itemId } = useParams({ strict: false });
  return (
    <>
      {!itemId && (
        <>
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Active Listings:</TableCell>
                <TableCell className="text-right">0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Saved Items:</TableCell>
                <TableCell className="text-right">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
      {itemId && (
        <>
          <div className="p-4 pb-0 text-center text-lg font-semibold">
            Seller
          </div>
          <div className="flex h-32 p-6 pb-0 center">
            <Avatar className="h-full w-auto">
              <AvatarImage
                src={"https://github.com/shadcn.png"}
                alt={`profile picture`}
              />
            </Avatar>
          </div>
          <div className="p-4 pt-0 text-center text-lg font-semibold">
            {"sellernickname"}
          </div>
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Member Since:</TableCell>
                <TableCell className="text-right">20002</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Items Sold:</TableCell>
                <TableCell className="text-right">12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Feedback:</TableCell>
                <TableCell className="text-right">5/5</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

export default MarketplaceSidebarContent;

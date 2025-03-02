import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { HandCoins } from "lucide-react";
import {
  api,
  insertListingSchema,
  itemConditions,
  marketplaceCategories,
  type Listing,
  type ListingInputs,
} from "../../lib/api-client";
import { formatFormErrors, singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const CreateListingDialog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "Technology",
      pic: undefined,
      price: 0,
      location: "",
      condition: "New",
    },
    validators: {
      onSubmit: insertListingSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await handleCreateListing.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
  });

  const handleCreateListing = useMutation({
    mutationKey: ["room", "new"],
    mutationFn: async (value: ListingInputs) => {
      const { pic, ...inputs } = value;
      const file = pic
        ? new File([pic as BlobPart], `listing-${Date.now()}`, {
            type: pic.type,
          })
        : null;
      const res = await api.listings.$post({
        form: {
          ...inputs,
          ...(file && { pic: file }),
        },
      });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData(["listing", data.id], data);
      queryClient.setQueryData(["listingsCreated"], (old: Listing[]) => [data, ...old]);
      navigate({
        to: "/marketplace/$category/$itemId",
        params: { category: data.category, itemId: data.id },
      });
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-full justify-between text-2xl [&_svg]:size-12">
          Sell An Item <HandCoins />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new listing</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Insert the details for your listing. A well defined photo and detailed description will
          help you to sell your item faster.
        </DialogDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <form.Field
                name="title"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Title</Label>
                      <Input
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        placeholder="Title"
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="flex justify-between gap-2">
              <div className="grid gap-2">
                <form.Field
                  name="price"
                  children={(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Price</Label>
                        <Input
                          name={field.name}
                          type="number"
                          value={field.state.value}
                          placeholder="Price"
                          min={1}
                          max={300000}
                          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                          required
                        />
                        {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                      </>
                    );
                  }}
                ></form.Field>
              </div>
              <div className="grid flex-1 gap-2">
                <form.Field
                  name="location"
                  children={(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Location</Label>
                        <Input
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          placeholder="Location"
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                        {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                      </>
                    );
                  }}
                ></form.Field>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="grid flex-1 gap-2">
                <form.Field
                  name="category"
                  children={(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Category</Label>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(e) =>
                            field.handleChange(e as (typeof marketplaceCategories)[number])
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {marketplaceCategories.map((cat, i) => (
                              <SelectItem key={i} value={cat} className="cursor-pointer">
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                      </>
                    );
                  }}
                ></form.Field>
              </div>
              <div className="grid flex-1 gap-2">
                <form.Field
                  name="condition"
                  children={(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Condition</Label>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(e) =>
                            field.handleChange(e as (typeof itemConditions)[number])
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemConditions.map((cond, i) => (
                              <SelectItem key={i} value={cond}>
                                {cond}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                      </>
                    );
                  }}
                ></form.Field>
              </div>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="pic"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Picture</Label>
                      <Input
                        name={field.name}
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          form.setFieldValue("pic", file);
                        }}
                      />
                      {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="description"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Description</Label>
                      <Input
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isTouched,
                state.isSubmitted,
              ]}
              children={([canSubmit, isSubmitting, isTouched, isSubmitted]) => {
                return (
                  <DialogFooter>
                    <Button
                      type="submit"
                      aria-disabled={!canSubmit || !isTouched}
                      disabled={!canSubmit || !isTouched}
                      className="w-full"
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                );
              }}
            />
            <form.Subscribe
              selector={(state) => [state.errorMap]}
              children={([errorMap]) =>
                errorMap.onSubmit ? (
                  <div>
                    <em>{errorMap.onSubmit?.toString()}</em>
                  </div>
                ) : null
              }
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingDialog;

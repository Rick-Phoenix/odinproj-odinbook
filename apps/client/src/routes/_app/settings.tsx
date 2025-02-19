import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useRef } from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import InsetScrollArea from "../../components/custom/inset-scrollarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useUser } from "../../hooks/auth";
import { useToast } from "../../hooks/use-toast";
import { api, type User } from "../../lib/api-client";
import { formatFormErrors, singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { username, oauthProvider } = useUser()!;

  return (
    <InsetScrollArea>
      <section className="flex min-h-[75svh] max-w-full flex-col rounded-xl bg-muted/50">
        <h2 className="mb-3 w-full scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Settings
        </h2>
        <div className="flex w-full flex-col justify-between gap-20 p-5 md:flex-row">
          <div className="order-2 flex flex-1 flex-col gap-8 md:order-1">
            <StatusEdit />
            {oauthProvider ? (
              <div className="flex flex-col gap-2 [&_svg]:size-12">
                <span className="border-b pb-1 font-semibold">Connected Profiles</span>
                <a
                  href={"https://github.com/" + username}
                  className="flex items-center gap-3 font-semibold hover:underline"
                >
                  <PiGithubLogoFill /> Github
                </a>
              </div>
            ) : (
              <PasswordEdit />
            )}
            <div className="flex size-full flex-col gap-2">
              <h2 className="mb-1 w-fit border-b-2 font-semibold text-red-800">Delete Account</h2>
              <DeleteAccountButton />
            </div>
          </div>
          <ProfilePictureEdit />
        </div>
      </section>
    </InsetScrollArea>
  );
}

const DeleteAccountButton = () => {
  const handleDelete = useMutation({
    mutationKey: ["userAccount"],
    mutationFn: async () => {
      const res = await api.users.user.$delete();
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("An error occurred while attempting to delete the account.");
      }
      return data;
    },
    onSuccess: () => {
      location.href = "/";
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"sm"} className="w-fit rounded-xl">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete.mutate()}
            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PasswordEdit = () => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      passConfirm: "",
    },
    validators: {
      onSubmit: schemas.updatePasswordSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await handlePasswordChange.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
  });

  const handlePasswordChange = useMutation({
    mutationKey: ["userPassword"],
    mutationFn: async (value: {
      oldPassword: string;
      newPassword: string;
      passConfirm: string;
    }) => {
      const res = await api.users.edit.password.$post({
        json: { ...value },
      });
      const resData = await res.json();
      if (typeof resData !== "string" && "issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
    onSuccess: () => {
      toast({ title: "Password changed successfully.", duration: 4000 });
      form.reset();
    },
  });
  return (
    <form
      className="flex size-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <h2 className="border-b-2 text-lg font-semibold">Change Password</h2>

      <div className="flex flex-col gap-2">
        <div className="grid gap-2">
          <form.Field
            name="oldPassword"
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Old Password</Label>
                  <Input
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </>
              );
            }}
          ></form.Field>
        </div>
        <div className="grid gap-2">
          <form.Field
            name="newPassword"
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>New Password</Label>
                  <Input
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </>
              );
            }}
          ></form.Field>
        </div>{" "}
        <div className="grid gap-2">
          <form.Field
            name="passConfirm"
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Confirm New Password</Label>
                  <Input
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </>
              );
            }}
          ></form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting, state.isTouched]}
          children={([canSubmit, isSubmitting, isTouched]) => {
            return (
              <Button
                type="submit"
                disabled={!canSubmit || !isTouched || isSubmitting}
                size={"sm"}
                className="mt-1 w-fit rounded-xl"
              >
                Change Password
              </Button>
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
  );
};

const StatusEdit = () => {
  const { status } = useUser()!;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      status: status || "",
    },
    validators: {
      onChange: schemas.updateStatusSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await handleStatusUpdate.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
  });

  const handleStatusUpdate = useMutation({
    mutationKey: ["userStatus"],
    mutationFn: async (value: { status: string }) => {
      const res = await api.users.edit.status.$post({
        json: { status: value.status },
      });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], (old: User) => ({
        ...old,
        status: data.newStatus,
      }));
      form.reset();
      toast({ title: "Status changed successfully.", duration: 4000 });
    },
  });
  return (
    <form
      className="flex size-full flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="grid gap-2">
          <form.Field
            name="status"
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name} className="text-lg font-semibold">
                    Status
                  </Label>
                  <Textarea
                    name={field.name}
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
          selector={(state) => [state.canSubmit, state.isSubmitting, state.isTouched]}
          children={([canSubmit, isSubmitting, isTouched]) => {
            return (
              <Button
                type="submit"
                disabled={!canSubmit || !isTouched || isSubmitting}
                size={"sm"}
                className="w-fit rounded-xl"
              >
                Change Status
              </Button>
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
  );
};

const ProfilePictureEdit = () => {
  const { avatarUrl } = useUser()!;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const form = useForm({
    defaultValues: {
      avatar: undefined as any as File | undefined,
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (!value.avatar) return "";
        if (!(value.avatar instanceof File)) return "Invalid file format.";
        if (value.avatar.size > 1000000)
          return "The profile picture must be 1 megabyte or smaller.";
        try {
          await handleAvatarUpdate.mutateAsync(value as { avatar: File });
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
  });

  const handleAvatarUpdate = useMutation({
    mutationKey: ["userAvatar"],
    mutationFn: async (value: { avatar: File }) => {
      const res = await api.users.edit.avatar.$post({
        form: {
          avatar: value.avatar,
        },
      });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], (user: User) => ({
        ...user,
        avatarUrl: data.newAvatarUrl,
      })),
        toast({ title: "Profile Picture Updated.", duration: 4000 });
    },
  });

  return (
    <>
      <form
        className="relative order-1 flex h-fit flex-col gap-2 text-center md:order-2"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex h-fit flex-col items-center gap-2 text-center">
          <h2 className="text-lg font-semibold">Profile Picture</h2>
          <div className="relative">
            <img src={avatarUrl} className="size-44 rounded-full" />
            <Button
              size={"sm"}
              type="button"
              className="absolute bottom-0 left-2 w-fit rounded-xl px-2"
              onClick={handleImageUpload}
            >
              <Pencil /> Edit
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <form.Field
              name="avatar"
              children={(field) => {
                return (
                  <>
                    <Input
                      ref={fileInputRef}
                      name={field.name}
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setFieldValue("avatar", file);
                          form.handleSubmit();
                        }
                      }}
                    />
                    {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                  </>
                );
              }}
            ></form.Field>
          </div>
        </div>
        <form.Subscribe
          selector={(state) => [state.errorMap]}
          children={([errorMap]) =>
            errorMap.onSubmit ? (
              <div className="max-w-44 break-normal">
                <em>{errorMap.onSubmit?.toString()}</em>
              </div>
            ) : null
          }
        />
      </form>
    </>
  );
};

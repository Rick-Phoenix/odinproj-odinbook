import { loginValidationSchema } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import { handleGithubLogin } from "../../hooks/auth";
import { api } from "../../lib/hono-RPC";
import { formatFormErrors, singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function LoginDialog({ disableClose }: { disableClose?: boolean }) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: loginValidationSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await handleLogin.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
  });

  const handleLogin = useMutation({
    mutationKey: ["user"],
    mutationFn: async (value: { username: string; password: string }) => {
      const res = await api.auth.login.$post({ json: value });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
    onSuccess: () => (location.href = "/"),
  });

  const handleDialogState = () => {
    if (open && disableClose) return;
    else setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogState} defaultOpen={!disableClose}>
      <DialogTrigger asChild>
        <button className="relative p-[3px]">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500" />
          <div className="group relative rounded-2xl bg-gray-950 px-8 py-2 font-semibold text-white transition duration-200 hover:bg-transparent hover:text-black">
            Log In
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-2xl">Login</DialogTitle>
        <DialogDescription>Enter your email below to login to your account</DialogDescription>
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
                name="username"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Username</Label>
                      <Input
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        placeholder="Username"
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="password"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Password</Label>
                      <Input
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        placeholder="Password"
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="flex gap-3">
              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isTouched,
                  state.isSubmitted,
                ]}
                children={([canSubmit, isSubmitting, isTouched, isSubmitted]) => {
                  return (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        aria-disabled={isSubmitting || isSubmitted}
                        disabled={isSubmitting || isSubmitted}
                        onClick={handleGithubLogin}
                      >
                        Login with Github <PiGithubLogoFill />
                      </Button>
                      <Button
                        type="submit"
                        aria-disabled={!canSubmit || !isTouched}
                        disabled={!canSubmit || !isTouched}
                        className="w-full"
                      >
                        Login
                      </Button>
                    </>
                  );
                }}
              />
            </div>
            <form.Subscribe
              selector={(state) => [state.errorMap]}
              children={([errorMap]) =>
                errorMap.onSubmit ? (
                  <div className="text-center">
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
}
export default LoginDialog;

import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import { handleGithubLogin } from "../../hooks/auth";
import { api } from "../../lib/api-client";
import { formatFormErrors, singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function SignupDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
    validators: {
      onSubmit: schemas.insertUserSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await handleSignup.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
  });

  const handleSignup = useMutation({
    mutationKey: ["user"],
    mutationFn: async (value: { username: string; password: string; email: string }) => {
      const res = await api.auth.signup.$post({ json: value });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
    onSuccess: () => (location.href = "/"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-8 py-2 font-bold text-white transition duration-200 hover:border-teal-500 hover:text-black">
          Sign Up
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-2xl">Sign Up</DialogTitle>
        <DialogDescription>Enter your email below to create a new account</DialogDescription>
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
                name="email"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Email</Label>
                      <Input
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        placeholder="Email"
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
                      type="submit"
                      aria-disabled={!canSubmit || !isTouched}
                      disabled={!canSubmit || !isTouched}
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      aria-disabled={isSubmitting || isSubmitted}
                      disabled={isSubmitting || isSubmitted}
                      onClick={handleGithubLogin}
                    >
                      Sign Up with Github <PiGithubLogoFill />
                    </Button>
                  </>
                );
              }}
            />
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
export default SignupDialog;

import { schemas } from "@nexus/shared-schemas";
import { Label } from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SignupForm } from "../components/signup-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { handleGithubLogin } from "../hooks/auth";
import { api } from "../lib/api-client";
import { errorTypeGuard } from "../utils/error-type-guard";
import { formatFormErrors, singleErrorsAdapter } from "../utils/form-utils";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
    validators: {
      onChange: schemas.signupValidationSchema,
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
    onSubmit() {
      location.href = "/";
    },
  });

  const handleSignup = useMutation({
    mutationKey: ["user"],
    mutationFn: async (value: {
      username: string;
      password: string;
      email: string;
    }) => {
      const res = await api.auth.signup.$post({ json: value });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
  });

  return (
    <SignupForm>
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
                    {field.state.meta.isTouched &&
                      formatFormErrors(field.state.meta.errors)}
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
                    {field.state.meta.isTouched &&
                      formatFormErrors(field.state.meta.errors)}
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
                    {field.state.meta.isTouched &&
                      formatFormErrors(field.state.meta.errors)}
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
                    Sign Up with Github
                  </Button>
                </>
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
        <div className="mt-4 text-center text-sm">
          Already have an account?{"   "}
          <Link to="/login" className="underline underline-offset-4">
            Log In
          </Link>
        </div>
      </form>
    </SignupForm>
  );
}

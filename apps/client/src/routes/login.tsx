import { schemas } from "@nexus/shared-schemas";
import { Label } from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginForm } from "../components/login-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { formatFormErrors, formErrorsSchema } from "../utils/form-utils";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { errorTypeGuard } from "../utils/error-type-guard";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: schemas.loginValidationSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const formSubmit = await handleLogin.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: formErrorsSchema,
    onSubmit({ value }) {
      location.href = "/";
      console.log(1);
    },
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
    // onSuccess(data, variables, context) {
    //   location.href = "/";
    // },
    // onError(error, variables, context) {
    //   console.log(error);
    // },
  });

  return (
    <LoginForm>
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
            ]}
            children={([canSubmit, isSubmitting, isTouched]) => {
              return (
                <>
                  <Button
                    type="submit"
                    aria-disabled={!canSubmit || !isTouched}
                    disabled={!canSubmit}
                    className="w-full"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    aria-disabled={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Login with Google
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
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
    </LoginForm>
  );
}

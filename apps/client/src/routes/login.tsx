import { zodSchemas } from "@nexus/shared-schemas";
import { Label } from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../components/login-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { formatFormErrors, formErrorsSchema } from "../utils/form-utils";

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
      onChange: zodSchemas.loginValidationSchema,
    },
    validatorAdapter: formErrorsSchema,
  });
  return (
    <LoginForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
          form.reset();
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
                      onBlur={field.handleBlur}
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
                      onBlur={field.handleBlur}
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
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <>
                <Button
                  type="submit"
                  aria-disabled={!canSubmit}
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
            )}
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

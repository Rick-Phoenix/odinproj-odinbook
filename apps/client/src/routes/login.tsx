import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../components/login-form";
import { Label } from "@radix-ui/react-label";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useForm } from "@tanstack/react-form";
import { zodSchemas } from "@nexus/shared-schemas";

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
      onChange: zodSchemas.signupValidationSchema.pick({
        username: true,
        password: true,
      }),
    },
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
                console.log(field.state);
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
                    field.state.meta.errors.length ? (
                      <em>{field.state.meta.errors.join(", ")}</em>
                    ) : null}
                    {field.state.meta.isValidating ? "Validating..." : null}
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
                    field.state.meta.errors.length ? (
                      <em>{field.state.meta.errors.join(", ")}</em>
                    ) : null}
                    {field.state.meta.isValidating ? "Validating..." : null}
                  </>
                );
              }}
            ></form.Field>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
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

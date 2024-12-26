import { useActionState } from "react";
import { apiUrl } from "./utils/utils";

type FormError = { message: string };

export default function SignUp() {
  const [errors, submitForm, isPending] = useActionState<
    FormError[] | null,
    FormData
  >(async (previousState, formData) => {
    const formObj = Object.fromEntries(formData);
    const response = await fetch(`${apiUrl}/users/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObj),
    });

    if (!response.ok) return response.json() as Promise<FormError[]>;
    return null;
  }, null);
  return (
    <>
      <form action={submitForm}>
        <fieldset disabled={isPending}>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" required />
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" required />
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" required />
          <button type="submit">Submit</button>
        </fieldset>
      </form>
      {errors && (
        <ul>
          {errors.map((err, i) => {
            return <li key={i}>{err.message}</li>;
          })}
        </ul>
      )}
    </>
  );
}

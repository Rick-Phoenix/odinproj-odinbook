import { useActionState } from "react";
import { apiUrl } from "./utils/utils";

export default function Login() {
  const [error, submitForm, isPending] = useActionState<
    string | null,
    FormData
  >(async (previousState, formData) => {
    const formObj = Object.fromEntries(formData);
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObj),
    });

    if (!response.ok) return response.json() as Promise<string>;
    return null;
  }, null);
  return (
    <>
      <form action={submitForm}>
        <fieldset disabled={isPending}>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" required />
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" required />
          <button type="submit">Submit</button>
        </fieldset>
      </form>
      {error && <h3>{error}</h3>}
    </>
  );
}

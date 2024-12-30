import { authClient } from "./lib/auth-client"; //import the auth client

export default function Login() {
  async function handleSignin() {
    const { data, error } = await authClient.signUp.email({
      email: "test@eaxampale.com",
      password: "password1234",
      name: "testaa",
      image: "https://example.com/image.png",
    });

    console.log(data, error);
  }

  const { data, isPending, error } = authClient.useSession();

  console.log(data, isPending, error);
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button type="button" onClick={handleSignin}>
        Submit
      </button>
    </>
  );
}

import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

const Teacher: NextPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <h1 className="text-3xl">Teacher page</h1>
        Signed as {session?.user.email}
        <button onClick={() => void signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <h1 className="text-3xl">Teacher page</h1>
      Not signed in <br />
      <button onClick={() => void signIn()}>Sign in</button>
    </>
  );
};

export default Teacher;

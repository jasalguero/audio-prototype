import { type NextPage } from "next";
import { useSession } from "next-auth/react";

const Teacher: NextPage = () => {
  const { status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <h1 className="text-3xl">Currently Logged in Students</h1>
    </>
  );
};

export default Teacher;

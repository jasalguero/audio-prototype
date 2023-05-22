import { Button, Card } from "flowbite-react";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Teacher: NextPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <h1 className="text-3xl">Teacher page</h1>
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome {session.user.name}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            You are logged in, click{" "}
            <Link
              href="/teacher/students"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              here
            </Link>{" "}
            to see your students
          </p>
          <Button color="failure" onClick={() => void signOut()}>
            Sign out
          </Button>
        </Card>
      </>
    );
  }
  return (
    <>
      <h1 className="text-3xl">Teacher page</h1>
      <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Use the button below to login as a teacher
        </h5>
        <Button color="success" onClick={() => void signIn()}>
          Sign in
        </Button>
      </Card>
    </>
  );
};

export default Teacher;

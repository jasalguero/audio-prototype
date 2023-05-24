import { Button, Label, TextInput } from "flowbite-react";
import type Peer from "peerjs";

export default function Profile({
  profile,
  onProfileCreated,
}: {
  profile?: Peer;
  onProfileCreated: (e: string) => void;
}) {
  const updateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    onProfileCreated(target.name.value);
  };

  const profileForm = () => {
    return (
      <form onSubmit={(e) => void updateProfile(e)}>
        <div className="mb-2 block">
          <Label htmlFor="name" value="Enter your name" />
        </div>
        <TextInput id="name" type="name" required={true} />
        <Button className="mt-5" type="submit">
          Submit
        </Button>
      </form>
    );
  };

  return (
    <>
      {profile ? (
        <h1 className="text-4xl">
          Profile created sucessfully :)
        </h1>
      ) : (
        profileForm()
      )}
    </>
  );
}

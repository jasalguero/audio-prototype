import { Button, Label, TextInput } from "flowbite-react";
import { type Peer, type DataConnection } from "peerjs";

export default function Call({
  profile,
  connection,
  onCallPeer,
  onCloseConnection,
}: {
  profile?: Peer;
  connection?: DataConnection;
  onCallPeer: (id: string) => void;
  onCloseConnection: () => void;
}) {
  const callPeer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    onCallPeer(target.name.value);
  };

  const callPeerForm = () => {
    return (
      <form onSubmit={callPeer}>
        <div className="mb-2 block">
          <Label htmlFor="name" value="Enter the id to call" />
        </div>
        <TextInput id="name" type="name" required={true} />
        <Button className="mt-5" type="submit">
          Submit
        </Button>
      </form>
    );
  };

  const activeCall = () => {
    return (
      <>
        <h1 className="text-4l">You are in a call with {connection?.peer}</h1>
        <Button color="failure" onClick={() => onCloseConnection()}>
          Hang
        </Button>
      </>
    );
  };

  return (
    <>
      {!profile ? (
        <h1 className="text-4xl">You need a profile to make a call!</h1>
      ) : connection ? (
        activeCall()
      ) : (
        callPeerForm()
      )}
    </>
  );
}

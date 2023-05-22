import { Tabs } from "flowbite-react";
import { type NextPage } from "next";
import { useState } from "react";
import Profile from "~/components/peerjs/profile";
import { type Peer } from "peerjs";
import Call from "~/components/peerjs/call";
import { error } from "console";

const Playground: NextPage = () => {
  const [peerProfile, setPeerProfile] = useState<Peer>();

  const createPeerProfile = (name: string) => {
    void import("peerjs").then(({ default: Peer }) => {
      const profile = new Peer(name);
      setPeerProfile(profile);
      profile.on("connection", function (conn) {
        console.log("connection established!", conn);

        conn.on("data", (data) => {
          console.log("incoming data!", data);
        })
      });
    });
  };

  const callPeer = (targetId: string) => {
    const connection = peerProfile?.connect(targetId);
    connection?.on("open", () => {
      connection.on("data", (data) => console.log("Received", data));
      connection?.send("hi");
    });
    connection?.on("error", (error) => {
      console.log("error in the connection", error);
    });
    console.log(connection);
  };

  return (
    <>
      <h1 className="mb-10 text-5xl">Peer Connection</h1>
      <Tabs.Group>
        <Tabs.Item title="Id">
          <Profile profile={peerProfile} onProfileCreated={createPeerProfile} />
        </Tabs.Item>
        <Tabs.Item title="Call">
          <Call profile={peerProfile} onCallPeer={callPeer} />
        </Tabs.Item>
        <Tabs.Item title="Receive"></Tabs.Item>
      </Tabs.Group>
    </>
  );
};

export default Playground;

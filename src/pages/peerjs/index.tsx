import { Tabs } from "flowbite-react";
import { type NextPage } from "next";
import { useState } from "react";
import Profile from "~/components/peerjs/profile";
import { type Peer, type DataConnection } from "peerjs";
import Call from "~/components/peerjs/call";
import styles from "./index.module.css";

const Playground: NextPage = () => {
  const [peerProfile, setPeerProfile] = useState<Peer>();
  const [activeConnection, setActiveConnection] = useState<DataConnection>();

  const createPeerProfile = (name: string) => {
    void import("peerjs").then(({ default: Peer }) => {
      const profile = new Peer(name);
      setPeerProfile(profile);
      profile.on("connection", function (connection) {
        console.log("connected");
        setActiveConnection(connection);

        connection.on("data", (data) => {
          console.log("incoming data!", data);
        });

        connection.on("error", (error) => {
          console.log("connection failed", error);
        });

        connection.on("close", () => {
          setActiveConnection(undefined);
        });
      });
    });
  };

  const callPeer = (targetId: string) => {
    const connection = peerProfile?.connect(targetId);
    connection?.on("open", () => {
      setActiveConnection(connection);
      connection.on("data", (data) => console.log("Received", data));
      connection?.send("hi");
    });
    connection?.on("error", (error) => {
      console.log("error in the connection", error);
    });
    connection?.on("close", () => {
      setActiveConnection(undefined);
    });
  };

  const closeConnection = () => {
    if (activeConnection) {
      console.log("closing active connection");
      activeConnection.close();
      setActiveConnection(undefined)
    }
  }

  const statusClass = activeConnection
    ? styles.status_busy
    : styles.status_available;

  return (
    <>
      <h1 className="mb-10 text-5xl">Peer Connection</h1>
      {peerProfile ? (
        <h1 className="text-4xl">
          Your profile id is <strong>{peerProfile.id}</strong>
          <span
            className={`${styles.connection_status_dot || ""} ${
              statusClass || ""
            }`}
          ></span>
        </h1>
      ) : (
        ""
      )}
      <Tabs.Group>
        <Tabs.Item title="Id">
          <Profile profile={peerProfile} onProfileCreated={createPeerProfile} />
        </Tabs.Item>
        <Tabs.Item title="Call">
          <Call
            profile={peerProfile}
            connection={activeConnection}
            onCloseConnection={closeConnection}
            onCallPeer={callPeer}
          />
        </Tabs.Item>
        <Tabs.Item title="Receive"></Tabs.Item>
      </Tabs.Group>
    </>
  );
};

export default Playground;

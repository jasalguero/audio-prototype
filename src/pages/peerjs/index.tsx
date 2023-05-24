import { Tabs } from "flowbite-react";
import { type NextPage } from "next";
import { useState } from "react";
import Profile from "~/components/peerjs/profile";
import { type Peer, type MediaConnection } from "peerjs";
import Call from "~/components/peerjs/call";
import styles from "./index.module.css";
import VideoCall from "~/components/peerjs/videoCall";

const Playground: NextPage = () => {
  const [peerProfile, setPeerProfile] = useState<Peer>();
  const [activeConnection, setActiveConnection] = useState<MediaConnection>();
  const [activeStream, setActiveStream] = useState<MediaStream>();

  const createPeerProfile = (name: string) => {
    void import("peerjs").then(({ default: Peer }) => {
      const profile = new Peer(name);
      setPeerProfile(profile);
      profile.on("call", function (call) {
        void (async () => {
          const stream = await window.navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          call.answer(stream);

          console.log("connected");
          setActiveConnection(call);

          call.on("stream", (remoteStream) => {
            setActiveStream(remoteStream);
            console.log("incoming data!", remoteStream);
          });

          call.on("error", (error) => {
            console.log("connection failed", error);
          });

          call.on("close", () => {
            console.log("closing current call");
            stream.getTracks().forEach(function (track) {
              track.stop();
            });
            setActiveConnection(undefined);
          });
        })();
      });
    });
  };

  const callPeer = async (targetId: string) => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const call = peerProfile?.call(targetId, stream);
    console.log("connecting call", call);

    setActiveConnection(call);
    call?.on("stream", (remoteStream) => {
      setActiveStream(remoteStream);
      console.log("receiving remote stream", remoteStream);
    });

    call?.on("error", (error) => {
      console.log("error in the connection", error);
    });
    call?.on("close", () => {
      console.log("closing current call");
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
      setActiveConnection(undefined);
    });
  };

  const closeConnection = () => {
    if (activeConnection) {
      console.log("closing active connection");
      activeConnection.close();
      setActiveConnection(undefined);
    }
  };

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
            onCallPeer={(targetId) => void callPeer(targetId)}
          />
        </Tabs.Item>
        <Tabs.Item title="Receive">
          <VideoCall videoStream={activeStream} />
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
};

export default Playground;

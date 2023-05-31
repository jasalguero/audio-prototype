import { Tabs, type TabsRef } from "flowbite-react";
import { type NextPage } from "next";
import { useRef, useState } from "react";
import Profile from "~/components/peerjs/profile";
import { type Peer, type MediaConnection } from "peerjs";
import Call from "~/components/peerjs/call";
import styles from "./index.module.css";
import VideoCall from "~/components/peerjs/videoCall";

enum TABS {
  PROFILE = 0,
  CALL = 1,
  VIDEOCALL = 2,
}

const Playground: NextPage = () => {
  const [peerProfile, setPeerProfile] = useState<Peer>();
  const [activeConnection, setActiveConnection] = useState<MediaConnection>();
  const [activeStream, setActiveStream] = useState<MediaStream>();
  const [activeTab, setActiveTab] = useState<number>(TABS.PROFILE);
  const tabsRef = useRef<TabsRef>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const handleStreamingError = (error: Error) => {
    console.log("connection failed", error);
  };

  const handleCloseStreams = () => {
    console.log("closing current call");
    if (localStreamRef?.current) {
      localStreamRef.current.getTracks().forEach(function (track) {
        track.stop();
      });
    }
    setActiveConnection(undefined);
  };

  const getCameraStream = async () => {
    return await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  };

  const getScreenStream = async () => {
    const displayOptions: DisplayMediaStreamOptions = {
      audio: false,
    };
    return await navigator.mediaDevices.getDisplayMedia(displayOptions);
  };

  const closeConnection = () => {
    if (activeConnection) {
      console.log("closing active connection");
      activeConnection.close();
      setActiveConnection(undefined);
    }
  };

  const handleReceivingStream = (remoteStream: MediaStream) => {
    tabsRef.current?.setActiveTab(TABS.VIDEOCALL);
    setActiveStream(remoteStream);
    console.log("incoming data!", remoteStream);
  };

  const createPeerProfile = (name: string) => {
    void import("peerjs").then(({ default: Peer }) => {
      const profile = new Peer(name);
      setPeerProfile(profile);
      profile.on("call", function (call) {
        void (async () => {
          const stream = await getCameraStream();
          call.answer(stream);
          localStreamRef.current = stream;
          console.log("connected");
          setActiveConnection(call);

          call.on("stream", handleReceivingStream);

          call.on("error", handleStreamingError);

          call.on("close", handleCloseStreams);
        })();
      });
    });
  };

  const addScreenShare = async () => {
    const screenStream = await getScreenStream();
    console.log("adding screensharing");
    activeConnection?.addStream(screenStream);
  }

  const callPeer = async (targetId: string) => {
    const stream = await getCameraStream();
    localStreamRef.current = stream;
    
    const call = peerProfile?.call(targetId, stream);
    console.log("connecting call", call);
    setActiveConnection(call);
    call?.on("stream", handleReceivingStream);
    call?.on("error", handleStreamingError);
    call?.on("close", handleCloseStreams);
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
      <Tabs.Group ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
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
          {activeStream?.getVideoTracks().map((videoTrack) => (
            <VideoCall key={videoTrack.id} videoStream={activeStream} onShareScreen={() => void addScreenShare()} />
          ))}
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
};

export default Playground;

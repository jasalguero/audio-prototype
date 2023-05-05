import { type NextPage } from "next";
import { useEffect } from "react";
import io from "socket.io-client";
let socket;

const socketInitializer = async () => {
  await fetch("/api/socket");
  socket = io();

  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("basicEmit", (data, data2, data3) => {
    console.log("basic emit", data, data2, data3);
  })
};
const Home: NextPage = () => {
  useEffect(() => {
    void socketInitializer();
  }, []);

  return (
    <>
      <h1 className="text-5xl">Hello there Matt</h1>
    </>
  );
};

export default Home;

import { type NextApiRequest, type NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: number) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  message: (text: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const initializeSocketServer = (server: SocketServer) => {
  console.log("Socket is initializing");
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server);

  io.on("connection", (socket) => {
    // send a message to the client
    socket.emit("basicEmit", 2, "hello", 3);

    // receive a message from the client
    socket.on("message", (data) => {
      console.log("message received", data);
    });
  });
  return io;
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res?.socket?.server?.io) {
    console.log("Socket is already running");
  } else {
    res.socket.server.io = initializeSocketServer(res.socket.server);
  }
  res.end();
};

export default SocketHandler;

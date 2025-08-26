import io from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log(" Connected to server:", socket.id);

  socket.emit("message", "Hello from the test client");
});

socket.on("reply", (msg: any) => {
  console.log(" Server says:", msg);
});

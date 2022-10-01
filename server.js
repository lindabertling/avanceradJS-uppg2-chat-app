const net = require("net");

// create array for connected clients
let sockets = [];

function messageAll(message, sendingSocket) {
  if (message.toString() === "quit") {
    // Remove the client from the connected clients array if they want to quit/leave the chat
    const index = sockets.indexOf(sendingSocket);
    sockets.splice(index, 1);
  } else {
    sockets.forEach((socket) => {
      // send message to all connected clients/sockets except for the sender
      if (socket !== sendingSocket) socket.write(message);
    });
  }
}

const server = net.createServer((socket) => {
  sockets.push(socket);
  console.log("Client connected.");
  socket.write("Welcome to the chat! 🤩");

  //Listen for incoming data
  socket.on("data", (data) => {
    messageAll(data, socket);
  });

  socket.on("error", (err) => {
    console.log(`An error has ocurred: ${err}`);
  });

  socket.on("close", () => {
    console.log("A client has left the chat.");
  });
});

// specifying what port the server shoulf listen to and printing a message of that in the terminal
server.listen(8080, () => {
  console.log(`The server is now listening on port: ${server.address().port}`);
});

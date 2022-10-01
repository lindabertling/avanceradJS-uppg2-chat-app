const net = require("net");

// Enable reading data from and outputting data to the command line.
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// make sure the user enters a port and a username before they are allowed to enter the chat.
// (The user needs to enter 4 digits as port otherwise the program will crash..)
const waitForUserInput = new Promise((resolve) => {
  readline.question(
    "Enter the server address and a username to join the chat <xxxx, username> ",
    (input) => {
      resolve(input);
    }
  );
});

waitForUserInput.then((input) => {
  // separenting the port and the username given in the user input
  const inputArr = input.split(", ");
  const serverPort = parseInt(inputArr[0]);
  const username = inputArr[1];

  const socket = net.connect({
    port: serverPort,
  });

  socket.on("connect", () => {
    socket.write(`${username} has joined the chat`);
  });

  // listening on the enter key being pressed on the keyboard and does something with the input (data)
  readline.on("line", (data) => {
    if (data === "quit") {
      socket.write(`${username} has left the chat.`);
      // setTimeout to not risk the message 'quit' gets mixed up with the above line.
      socket.setTimeout(1000);
    } else {
      socket.write(`${username}: ${data}`);
    }
  });

  socket.on("timeout", () => {
    socket.write("quit");
    socket.end();
  });

  // Listen for incoming messages and print them in the terminal
  socket.on("data", (data) => {
    // make incomming messages a different color to make them stand out compared to what is typed into the command line
    console.log("\x1b[33m%s\x1b[0m", data);
  });

  socket.on("end", () => {
    process.exit();
  });

  socket.on("error", (err) => {
    console.log(`An error has ocurred: ${err}`);
  });
});

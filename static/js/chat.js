/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username?");


/** called when connection opens, sends join info to server. */

ws.onopen = function (evt) {
  console.log("open", evt);

  let data = { type: "join", name: name };
  ws.send(JSON.stringify(data));
};

// Approach

// You could do this by:

// change client-side chat.js to recognize the /joke 
// command and send a different type of message to server, like 
// {type: "get-joke"}. Have the ChatUser method that handles 
// messages call out to a new method that gets a joke. It could 
// return a response to the client, like {type: "chat", text: "What 
// do you call eight hobbits? A hob-byte! ", name: "Server"}

/** called when msg received from server; displays it. */

ws.onmessage = async function (evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  }

  else if (msg.type === "chat") {
    if (msg.text === "/joke") {
      let response = await $.getJSON("http://icanhazdadjoke.com");
      console.log("RESPONSE========", response)
      item = $(`<li>${response.joke}</li>`);
    }
    else {
      item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
    }
  }

  else {
    return console.error(`bad message: ${msg}`);
  }

  $('#messages').append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. */

$('form').submit(function (evt) {
  evt.preventDefault();

  let data = { type: "chat", text: $("#m").val() };
  ws.send(JSON.stringify(data));

  $('#m').val('');
});
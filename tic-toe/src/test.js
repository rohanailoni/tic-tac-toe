const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8000/ws/chat/rohan');


ws.onopen=()=>{
    console.log("connection open to server");
    ws.send(JSON.stringify({"message":"You won"}));
}
ws.onmessage = e => {
    console.log(e.data)
  }

// ws.send(JSON.stringify({"message":"You won"}))
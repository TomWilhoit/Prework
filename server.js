const http = require("http");
const url = require('url');
const server = http.createServer();

let messages = [
  { 'id': 1, 'user': 'brittany storoz', 'message': 'hi there!' },
  { 'id': 2, 'user': 'bob loblaw', 'message': 'check out my law blog' },
  { 'id': 3, 'user': 'lorem ipsum', 'message': 'dolor set amet' }
];


const getAllMessages = (response ) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  let messagesReturn = messages.map(message => {
    return message.message
  })
  response.write(JSON.stringify(messagesReturn));
  response.end();
}

const addMessage = (message, response) => {
  response.writeHead(201, {'Content-Type': 'application/json'});
  messages.push(message)
  response.write(JSON.stringify(message))
  response.end()
}

server.on('request', (request, response) => {
  if (request.method === 'GET') {
    getAllMessages(response);
  }
  
  else if (request.method === 'POST') {
    let newMessage = { 'id': new Date() };
    
    request.on('data', (data) => {
      newMessage = Object.assign(newMessage, JSON.parse(data));
    });
    
    request.on('end', () => {
      addMessage(newMessage, response);
    });
  }
});


server.listen(3000, () => {
  console.log('The HTTP server is listening at Port 3000.');
});
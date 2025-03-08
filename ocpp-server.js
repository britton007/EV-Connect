const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9000 });

wss.on('connection', ws => {
  console.log('Charge point connected');

  ws.on('message', message => {
    console.log(`Received: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Charge point disconnected');
  });

  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });
});

console.log('OCPP server started on port 9000');

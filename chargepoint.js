const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9000');

ws.onopen = () => {
  console.log('Connected to OCPP server');
  ws.send('Hello from ChargePoint!');
};

ws.onmessage = (event) => {
  console.log(`Received: ${event.data}`);
};

ws.onclose = () => {
  console.log('Disconnected from OCPP server');
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

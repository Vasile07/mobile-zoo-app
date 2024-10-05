const baseUrl = `ws://localhost:3000`;

export const newWebSocket = (onMessageReceived: (data: any) => void) => {
 const ws = new WebSocket(baseUrl)
 ws.onopen = () => {
    // ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
  };
  ws.onclose = () => {
  };
  ws.onerror = error => {
  };
  ws.onmessage = messageEvent => {
    console.log(messageEvent.data)
    onMessageReceived(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
} 
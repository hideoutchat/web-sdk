import WebSocket from 'ws';

const DEFAULT_WEB_SOCKET_IMPLEMENTATION = WebSocket;

const Networking = function Networking(WebSocket = DEFAULT_WEB_SOCKET_IMPLEMENTATION) {
  this.connect = ({ onConnect, onDisconnect, onError, url }) => {
    const webSocket = new WebSocket(url);

    webSocket.addEventListener('error', onError);

    webSocket.addEventListener('open', () => {
      const objectReceiversByType = {};

      onConnect({
        onReceive: (type, receive) => {
          if (!objectReceiversByType[type]) {
            objectReceiversByType[type] = [];
          }

          objectReceiversByType[type].push(receive);
        },
        send: (type, object) => {
          const message = JSON.stringify({ [type]: object, type });
          webSocket.send(message);
        }
      });

      webSocket.addEventListener('message', (event) => {
        try {
          const object = JSON.parse(event.data);
          const { [object.type]: objectReceivers = [] } = objectReceiversByType;

          for (const receive of objectReceivers) {
            receive(object[object.type]);
          }
        } catch (error) {
          onError(error);
        }
      });

      webSocket.addEventListener('close', () => () => {
        onDisconnect(new Networking(WebSocket));
      });
    });
  };

  return this;
};

export default Networking;

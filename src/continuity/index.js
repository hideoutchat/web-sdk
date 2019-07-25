const Continuity = function Continuity(nextProtocol) {
  this.connect = ({ onConnect, onDisconnect, onError, onPublicKey, privateKey, url }) => {
    nextProtocol.connect({
      onConnect: (nextProtocol) => {
        onConnect({
          broadcast: (type, event) => nextProtocol.broadcast(type, event),
          onBroadcast: (type, onEvent) => nextProtocol.onBroadcast(type, onEvent),
          onGroupEvent: (symmetricKey, onEvent) => nextProtocol.onGroupEvent(symmetricKey, onEvent),
          onPeerEvent: (onEvent) => nextProtocol.onPeerEvent(onEvent),
          sendGroupEvent: (symmetricKey, event) => nextProtocol.sendGroupEvent(symmetricKey, event),
          sendPeerEvent: (publicKey, event) => nextProtocol.sendPeerEvent(publicKey, event)
        });
      },
      onDisconnect,
      onError,
      onPublicKey,
      privateKey,
      url
    });
  };

  return this;
};

export default Continuity;

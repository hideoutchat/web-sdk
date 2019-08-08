# Hideout SDK for Web Browsers

[![CircleCI][1]][2]
[![npm version][3]][4]
[![npm downloads][5]][4]
[![dependencies][6]][7]
[![devDependencies][8]][7]
[![license][9]][10]

This library includes all the necessary pieces for communicating on the
Hideout network from within a modern web browser.

## Installing

Using Yarn: `yarn add @hideoutchat/web-sdk`.
Using NPM: `npm install @hideoutchat/web-sdk`.

## Usage

```javascript
import { hideout } from '@hideoutchat/web-sdk';

hideout(WebSocket).connect({
  onConnect(connection) {
    // Connection includes:
    // * #broadcast(): Send a signed but unencrypted message to all peers.
    // * #onBroadcast(): Listen for unencrypted messages from peers.
    // * #onGroupEvent(): Listen for encrypted group messages from peers.
    // * #onPeerEvent(): Listen for encrypted direct messages from peers.
    // * #sendGroupEvent(): Send a signed and encrypted message to a group using a symmetric key.
    // * #sendPeerEvent(): Send a signed and encrypted DH message to a peer.
  },

  onDisconnect() {
    // Recommended:
    // * Clean up after #onConnect()
    // * Retry #connect() with exponential back-off.
  },

  onError(error) {
    // This function gets called any time an error occurs.
    // Fatal errors will also trigger #onDisconnect().
  },

  onPublicKey(publicKey) {
    // EC384 public key in JWK JSON format
    // The `kid` property should be a SHA-256 hash of the public key.
  },

  privateKey: {
    // EC384 private key in JWK JSON format
    // Generate this however you wish.
    // The `kid` property should be a SHA-256 hash of the public key.
  },

  // The URL of a Hideout rendezvous node listening on a secure web socket
  url: 'wss://example.com:1234'
});
```

[1]: https://img.shields.io/circleci/build/github/hideoutchat/web-sdk
[2]: https://circleci.com/gh/hideoutchat/web-sdk
[3]: https://img.shields.io/npm/v/@hideoutchat/web-sdk.svg
[4]: https://www.npmjs.com/package/@hideoutchat/web-sdk
[5]: https://img.shields.io/npm/dt/@hideoutchat/web-sdk.svg
[6]: https://img.shields.io/david/hideoutchat/web-sdk.svg
[7]: https://github.com/hideoutchat/web-sdk/blob/master/package.json
[8]: https://img.shields.io/david/dev/hideoutchat/web-sdk.svg
[9]: https://img.shields.io/github/license/hideoutchat/web-sdk.svg
[10]: https://github.com/hideoutchat/web-sdk/blob/master/LICENSE.md

import 'regenerator-runtime/runtime';

import Authentication from './authentication';
import Confidentiality from './confidentiality';
import Continuity from './continuity';
import Networking from './networking';
import Routing from './routing';

export const hideout = (...args) => {
  const protocolStack = [
    Networking,
    Routing,
    Authentication,
    Confidentiality,
    Continuity
  ];

  return protocolStack.reduce((nextProtocol, Protocol) => new Protocol(nextProtocol), new (protocolStack.shift())(...args));
};

export default { hideout };

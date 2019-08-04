import createShapeMatcher from './shape-matcher';

const Routing = function Routing(nextProtocol) {
  this.connect = ({ onConnect, onDisconnect, onError, url }) => {
    nextProtocol.connect({
      onConnect: (nextProtocol) => {
        const state = {
          subscriptions: []
        };

        nextProtocol.onReceive('publish', (event) => {
          for (const { isMatchingEvent, subscribers } of state.subscriptions) {
            if (isMatchingEvent(event)) {
              for (const { onEvent } of subscribers) {
                onEvent(event);
              }
            }
          }
        });

        onConnect({
          publish: (type, event = {}) => {
            nextProtocol.send('publish', { [type]: event, type });
          },

          subscribe: (shape, onEvent) => {
            const handle = {};
            const shapeKey = JSON.stringify(shape);
            const index = state.subscriptions.findIndex((it) => it.shapeKey === shapeKey);

            if (index < 0) {
              state.subscriptions.push({
                isMatchingEvent: createShapeMatcher(shape),
                shape,
                shapeKey,
                subscribers: [{ handle, onEvent }]
              });

              nextProtocol.send('subscribe', shape);
            } else if (!state.subscriptions[index].subscribers.some((it) => it.onEvent === onEvent)) {
              state.subscriptions[index].subscribers.push({ handle, onEvent });
            }

            return handle;
          },

          unsubscribe: (shape, handle) => {
            const shapeKey = JSON.stringify(shape);
            const subscriptionIndex = state.subscriptions.findIndex((it) => it.shapeKey === shapeKey);

            if (subscriptionIndex >= 0) {
              const { subscribers } = state.subscriptions[subscriptionIndex];
              const subscriberIndex = subscribers.findIndex((it) => it.handle === handle);

              if (subscriberIndex >= 0) {
                subscribers.splice(subscriberIndex, 1);
              }

              if (subscribers.length <= 0) {
                state.subscriptions.splice(subscriptionIndex, 1);
                nextProtocol.send('unsubscribe', shape);
              }
            }
          }
        });
      },
      onDisconnect,
      onError,
      url
    });
  };

  return this;
};

export default Routing;

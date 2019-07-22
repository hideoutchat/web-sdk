## Thoughts

 * Decorate each of these to enforce continuity on inbound and outbound events.
 * Ignore identical/duplicate inbound events.
 * Throw error for inbound events with conflicting sequence.
 * Decorate outbound events with the appropriate sequence and hash.
 * Verify inbound events have the expected sequence and hash.
 * Throw error for inbound events with impossible sequence and/or hash.
 * Enqueue inbound events with possible sequence and/or hash but cannot yet be verified due to a missing event.
 * Request re-transmission of missing event(s) under certain circumstances.
 * Acknowledge inbound events every so often as a courtesy to the sender, allowing them the opportunity to clean up cached events.
 * Do not enforce continuity for inbound or outbound acknowledgments.
 * Are Continuity and Reliability the same responsibility, or can they be decoupled?

## Sample Code

```
import { SHA3 } from 'sha3';

const hash = (...chunks) => {
  // In this case, "256" is not a magic number -- it legitimately communicates an intent.
  // eslint-disable-next-line no-magic-numbers
  const sha3 = new SHA3(256);
  for (const chunk of chunks) {
    sha3.update(chunk);
  }
  return sha3.digest('base64');
};

const getInitialSequence = () => 1;
const getNextSequence = (previousEvent) => previousEvent.sequence + 1;

const getInitialHash = ({ symmetricKey, publicKey }) => hash(symmetricKey.kid, publicKey.kid, 'hash');
const getNextHash = (previousEvent) => hash(JSON.stringify(previousEvent));
```

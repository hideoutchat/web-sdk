import adjective from '../../words/adjectives';
import animal from '../../words/animals';
import base64ToBuffer from '../../encoding/base64-to-buffer';

export default (id) => {
  const b = base64ToBuffer(id);
  return `${adjective(b[0])} ${animal(b[b.length - 1])}`;
};

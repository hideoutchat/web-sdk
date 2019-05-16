const createShapeMatcher = (shape) => {
  const keys = Object.keys(shape);

  // eslint-disable-next-line complexity, max-statements
  return (object) => {
    if (shape === object) {
      return true;
    }

    if (typeof object !== typeof shape) {
      return false;
    }

    if (typeof object !== 'object') {
      return false;
    }

    for (const key of keys) {
      const { [key]: shapeValue } = shape;
      const { [key]: objectValue } = object;

      const isMatch = createShapeMatcher(shapeValue);

      if (!isMatch(objectValue)) {
        return false;
      }
    }

    return true;
  };
};

export default createShapeMatcher;

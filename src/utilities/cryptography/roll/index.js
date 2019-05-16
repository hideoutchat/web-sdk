export default (count, sides, modifier) => {
  let sum = isNaN(modifier) ? 0 : modifier;

  for (let i = 0; i < count; i++) {
    sum += Math.ceil(Math.random() * sides);
  }

  return sum;
};

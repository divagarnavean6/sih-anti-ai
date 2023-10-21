export const curryable = func => {
  const curry = (...args) => {
    return args.length >= func.length ? func.apply(null, args) : curry.bind(null, ...args);
  };

  return curry;
};
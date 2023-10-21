export function pipe(...functions) {
  return data => functions.reduce((acc, func) => func(acc), data);
}
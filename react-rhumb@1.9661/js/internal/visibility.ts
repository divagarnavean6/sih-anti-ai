export const visibilityState = () => document.visibilityState;
export const isHidden = () => document.visibilityState === 'hidden';
export const onVisibilityChange = callback => {
  document.addEventListener('visibilitychange', () => {
    callback(document.visibilityState);
  });
};
export const onVisibilityHidden = callback => {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      callback();
    }
  });
};
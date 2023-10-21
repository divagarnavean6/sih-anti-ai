const BLANK_TARGET = '_blank';
export const openLinksInNewTab = ({
  node,
  node_name
}) => {
  if (node_name === 'a' && node && node.attributes && node.getAttribute('target') !== BLANK_TARGET) {
    node.setAttribute('target', BLANK_TARGET);
    return {
      node
    };
  }

  return null;
};
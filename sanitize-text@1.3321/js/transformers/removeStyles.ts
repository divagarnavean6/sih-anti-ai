export const BLOCKLISTED_STYLES = ['background-image', 'bottom', 'clear', 'float', 'left', 'opacity', 'position', 'right', 'top', 'visibility', 'white-space', 'z-index'];
export const removeStyles = ({
  node
}) => {
  if (node && node.style && node.style.length > 0 && node.style.removeProperty) {
    if (node.style.fontSize === '0px') {
      node.style.setProperty('font-size', '14px');
    }

    if (node.style.lineHeight === '0') {
      node.style.setProperty('line-height', '1');
    }

    if (node.style.color === 'transparent') {
      node.style.removeProperty('color');
    }

    BLOCKLISTED_STYLES.forEach(style => node.style.removeProperty(style));
    return {
      node
    };
  }

  return null;
};
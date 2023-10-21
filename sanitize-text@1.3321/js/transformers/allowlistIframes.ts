const doesMatchAnyRegex = ({
  regexes = [],
  string = ''
}) => regexes.some(regex => string.match(regex));

export const allowlistIframes = ({
  node,
  node_name,
  allowedDomainsForIframe
}) => {
  if (node_name === 'iframe' && node && node.attributes && node.getAttribute('src') && !doesMatchAnyRegex({
    regexes: allowedDomainsForIframe,
    string: node.getAttribute('src') || ''
  })) {
    node.removeAttribute('src');
    return {
      node
    };
  }

  return null;
};
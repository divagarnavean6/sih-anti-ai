// https://issues.hubspotcentral.com/browse/CRMMAIL-6967
// Remove unnecessary margins to allow users to see more content in thread view
export const standardizeBlockQuoteStyling = ({
  node
}) => {
  if (node && node.tagName === 'BLOCKQUOTE') {
    node.style.setProperty('margin', '0px 0px 0px .8ex');
    node.style.setProperty('padding-left', '1ex');
    node.style.setProperty('border-left', '1px solid rgb(204,204,204)');
    return {
      node
    };
  }

  return null;
};
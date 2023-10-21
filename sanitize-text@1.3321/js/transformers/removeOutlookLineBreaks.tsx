import { secureDocument } from '../sanitizers/SanitizeConfiguration';

const isOutlookEmailWithChildren = (node, nodeName) => nodeName === 'p' && node && node.classList && node.classList.contains('MsoNormal') && node.children && node.children.length;

const removeNbsp = node => {
  const op = secureDocument.createElement('o:p');

  if (node.innerHTML.includes('&nbsp;')) {
    op.innerHTML = node.innerHTML.replace(/&nbsp;/g, '').trim();
    return op;
  }

  return node;
};

const isEmptyBrokenParagraph = node => {
  if (!node || node.tagName.toLowerCase() !== 'o:p') {
    return false;
  } // https://issues.hubspotcentral.com/browse/CRMMAIL-6523
  // "<o:p> &nbsp;SampleText&nbsp; </o:p>" was being detected as an empty broken
  // paragraph and "SampleText" would not render. We have to recreate the
  // "<o:p> SampleText </o:p>" without &nbsp; to check for any other existing text


  const nodeWithoutNbsp = removeNbsp(node);
  return !nodeWithoutNbsp.children.length && nodeWithoutNbsp.innerHTML === '';
};

const isSpanWithBrokenParagraph = child => child && child.tagName.toLowerCase() === 'span' && isEmptyBrokenParagraph(child.firstElementChild);

export const removeOutlookLineBreaks = ({
  node,
  node_name
}) => {
  if (!isOutlookEmailWithChildren(node, node_name)) {
    return null;
  }

  const child = node.firstElementChild;

  if (child && isSpanWithBrokenParagraph(child) && child.childNodes.length > 1) {
    // https://issues.hubspotcentral.com/browse/CRMMAIL-5459
    // the <span> has child content other than the empty, broken paragraph
    // so we need to remove only the empty, broken paragraph "<o:p> &nbsp; </o:p>"
    // Don't use ChildNode.remove() for IE11 support
    const grandChild = child.firstElementChild;

    if (grandChild) {
      child.removeChild(grandChild);
      return removeOutlookLineBreaks({
        node,
        node_name: 'p'
      });
    }
  }

  if (child && (isEmptyBrokenParagraph(child) || isSpanWithBrokenParagraph(child))) {
    // https://issues.hubspotcentral.com/browse/CRMMAIL-3503
    // https://issues.hubspotcentral.com/browse/CRMMAIL-5147
    if (node.childNodes.length > 1) {
      // remove the empty, broken paragraph "<o:p> &nbsp; </o:p>"
      node.removeChild(child); // process the rest of the node in case there are other broken paragraphs to remove

      return removeOutlookLineBreaks({
        node,
        node_name: 'p'
      });
    }

    return {
      node: secureDocument.createElement('br')
    };
  }

  const div = secureDocument.createElement('div');
  Object.values(node.attributes).forEach(attribute => {
    try {
      if (attribute.nodeValue) {
        div.setAttribute(attribute.nodeName, attribute.nodeValue);
      }
    } catch (err) {// Customer has malformed HTML, this allows us to catch the error and proceed with parsing
      // https://issues.hubspotcentral.com/browse/CRMMAIL-7984
    }
  }); // https://issues.hubspotcentral.com/browse/CRMMAIL-4310

  div.innerHTML = node.innerHTML.replace(/&nbsp;/g, ' ').trim();
  return {
    node: div
  };
};
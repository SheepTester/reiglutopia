const SVG_NS = 'http://www.w3.org/2000/svg';

function createElement(tag, attributes) {
  if (typeof attributes !== 'object') attributes = {};
  let elem = attributes.svg ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
  return setAttributes(elem, attributes);
}

/**
 * PROPERTIES
 * @param {boolean} svg - if this is an SVG element
 * @param {string} classes - the `class` property
 * @param {array} classes - classes (falsey items ignored)
 * @param {object} data - data attributes (false and undefined ignored)
 * @param {object} attr - other attributes (false and undefined ignored)
 * @param {object} styles - styles
 * @param {string|number} content - HTML of element
 * @param {array} content - child elements or textnodes to be appended
 * @param {*} value - value (not undefined)
 * @param {string|number} tabindex - tabindex
 * @param {boolean} disabled - if disabled
 * @param {boolean} readOnly - if readOnly
 * @param {*} type - type (not undefined)
 */
function setAttributes(elem, attributes) {
  if (typeof attributes !== 'object') attributes = {};

  if (typeof attributes.classes === 'string')
    elem.className = attributes.classes;
  else if (attributes.classes)
    attributes.classes.forEach(c => c && elem.classList.add(c));

  if (attributes.data)
    Object.keys(attributes.data).forEach(d => (d === false || d === undefined) && (elem.dataset[d] = attributes.data[d]));

  if (attributes.attr)
    Object.keys(attributes.attr).forEach(d => (d === false || d === undefined) && (attributes.svg ? elem.setAttributeNS(null, d, attributes.attr[d]) : elem.setAttribute(d, attributes.attr[d])));

  if (attributes.styles)
    Object.keys(attributes.styles).forEach(s => elem.style[s] = attributes.styles[s]);

  if (typeof attributes.content === 'string' || typeof attributes.content === 'number') elem.innerHTML = attributes.content;
  else if (attributes.content)
    attributes.content.forEach(e => e && elem.appendChild(typeof e === 'object' ? e : document.createTextNode(e)));

  if (attributes.value !== undefined) elem.value = attributes.value;
  if (attributes.tabindex !== undefined && typeof attributes.tabindex !== 'boolean')
    elem.setAttribute('tabindex', attributes.tabindex);
  if (attributes.disabled !== undefined) elem.disabled = attributes.disabled;
  if (attributes.readOnly !== undefined) elem.readOnly = attributes.readOnly;
  if (attributes.type !== undefined) elem.type = attributes.type;

  return elem;
}

function createFragment(elems) {
  const fragment = document.createDocumentFragment();
  elems.forEach(elem => elem instanceof Element ? fragment.appendChild(elem) : typeof elem === 'string' && document.createTextNode(elem));
  return fragment;
}

function createElementFromHTML(html) {
  const tempDiv = document.createElement('div'),
  fragment = document.createDocumentFragment();
  tempDiv.innerHTML = html;
  Array.from(tempDiv.childNodes).forEach(e => fragment.appendChild(e));
  return fragment;
}

function clearChildren(elem) {
  while (elem.firstChild) elem.removeChild(elem.firstChild);
}

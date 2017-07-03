import R from 'ramda';
import Either from 'data.either';

/* eslint new-cap:0 */

// props :: String -> HTMLELement -> Either
const props = R.curry((prop, elem) => {
  if (prop in elem) {
    return Either.Right(elem[prop]);
  }

  return Either.Left(`The element ${elem.toString()} doesnt't have the property ${prop}`);
});

// getShadowRoot :: HTMLElement -> Either(ShadowRoot)
const getShadowRoot = elem => props('shadowRoot', elem);

// changeProps :: String -> <T> -> HTMLElement
const changeProps = R.curry((prop, value, elem) => {
  elem[prop] = value;
});

// isEmpty :: [] -> Either([])
const isEmpty = (arr) => {
  if (!arr.length) {
    return Either.Left('Empty Array');
  }

  return Either.Right(arr);
};

// isNil :: <Element> -> Either(<Element>)
const isNil = (x) => {
  if (R.isNil(x)) {
    return Either.Left('Element is undefined or null');
  }

  return Either.Right(x);
};

// isArray :: Array -> Either(Array)
const isArray = (arr) => {
  if (Array.isArray(arr) || arr.length) {
    return Either.Right(arr);
  }

  return Either.Left(`Element ${arr.toString()} is not an array`);
};

// logError :: String -> String -> _
const logError = R.curry((componentName, err) => console.error(`<${componentName}>: ${err}`));

// emitEvent :: Boolean -> Boolean -> Object -> String -> HTMLElement
const emitEvent = R.curry((bubbles, cancelable, detail, eventName, elem) => {
  const event = new CustomEvent(eventName, { bubbles, cancelable, detail, composed: true });
  elem.dispatchEvent(event);
});

// childNodes :: HTMLElement :: Either(HTMLElement)
const childNodes = doc => Either.fromNullable(doc).map(R.prop('childNodes'));

// firstElementChild :: HTMLElement :: Either(HTMLElement)
const firstElementChild = doc => Either.fromNullable(doc).map(R.prop('firstElementChild')).chain(isNil);

// getElementByTagsName :: String -> HTMLElement -> HTMLElement
const getElementByTagsName = R.curry((tag, doc) => doc.getElementsByTagName(tag));

// getElementByTagName :: String -> HTMLElement -> Either(HTMLElement)
const getElementByTagName = R.curry((tag, doc) => Either.fromNullable(doc)
  .map(getElementByTagsName(tag))
  .chain(isEmpty)
  .map(R.nth(0)));

// log :: IO
const log = (x) => {
  console.log(x);
  return x;
};

// changeProperty :: String -> String -> HTMLElement -> IO
const changeProperty = R.curry((prop, value, elem) => {
  /* eslint arrow-body-style:0 no-param-reassign:0 */
  elem[prop] = value;
});

// nth :: Number -> Array -> Either
const nth = R.curry((n, arr) => {
  return Either.fromNullable(arr)
    .chain(isNil)
    .chain(isArray)
    .map(R.nth(n))
    .chain(isNil);
});

// querySelector :: String -> HTMLElement -> Either(HTMLELement)
const querySelector = R.curry((query, doc) =>
  Either.fromNullable(doc).map(_doc => _doc.querySelector(query)).chain(isNil));

// assignedNodes :: HTMLElement<slot> ->Either([HTMLELement])
const assignedNodes = doc => Either.fromNullable(doc)
                                .map(_elem => _elem.assignedNodes())
                                .chain(isNil);

// equals :: <T> -> <T> -> Boolean
const equals = R.curry((x, y) => {
  if (x === y) {
    return true;
  }

  return false;
});

// diffs :: <T> -> <T> -> Boolean
const diffs = R.curry((x, y) => {
  if (x !== y) {
    return true;
  }

  return false;
});

// toggleClass :: String -> ClassList -> _
const toggleClass = R.curry((className, classList) => {
  classList.toggle(className);
});

// addClass :: String -> ClassList -> _
const addClass = R.curry((className, classList) => {
  classList.add(className);
});

// removeClass :: String -> ClassList -> _
const removeClass = R.curry((className, classList) => {
  classList.remove(className);
});

function splat(fn) {
  return function (list) {
    return Array.prototype.map.call(list, fn);
  };
}

class Helper {}

Helper.changeProps = changeProps;
Helper.props = props;
Helper.getShadowRoot = getShadowRoot;
Helper.logError = logError;
Helper.emitEvent = emitEvent;
Helper.childNodes = childNodes;
Helper.firstElementChild = firstElementChild;
Helper.getElementByTagName = getElementByTagName;
Helper.changeProperty = changeProperty;
Helper.log = log;
Helper.isNil = isNil;
Helper.nth = nth;
Helper.querySelector = querySelector;
Helper.assignedNodes = assignedNodes;
Helper.equals = equals;
Helper.diffs = diffs;
Helper.splat = splat;
Helper.toggleClass = toggleClass;
Helper.addClass = addClass;
Helper.removeClass = removeClass;

export default Helper;

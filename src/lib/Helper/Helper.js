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

// logError :: String -> String -> _
const logError = R.curry((componentName, err) => console.error(`<${componentName}>: ${err}`));

// emitEvent :: Boolean -> String -> HTMLElement
const emitEvent = R.curry((bubbles, cancelable, detail, eventName, elem) => {
  const event = new CustomEvent(eventName, { bubbles, cancelable, detail });
  elem.dispatchEvent(event);
});

// childNodes :: HTMLElement :: Either(HTMLElement)
const childNodes = doc => Either.fromNullable(doc).map(R.prop('childNodes'));

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

// nth :: Number -> Array -> Either
const nth = R.curry((n, arr) => {
  return Either.fromNullable(arr)
    .chain(isNil)
    .chain(isArray)
    .map(R.nth(n))
    .chain(isNil);
});

class Helper {}

Helper.changeProps = changeProps;
Helper.props = props;
Helper.getShadowRoot = getShadowRoot;
Helper.logError = logError;
Helper.emitEvent = emitEvent;
Helper.childNodes = childNodes;
Helper.getElementByTagName = getElementByTagName;
Helper.changeProperty = changeProperty;
Helper.log = log;
Helper.isNil = isNil;
Helper.nth = nth;

export default Helper;
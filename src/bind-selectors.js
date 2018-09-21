const isFunction = fn => typeof fn === "function";
const isString = val => typeof val === "string";

const get = path => obj =>
  path.split(".").reduce((val, prop) => val && val[prop], obj);

const bindSelector = (context, selector) => {
  const path = isString(context) ? get(context) : context;
  return (state, ...args) => selector(path(state), ...args);
};

/**
 * Transforms an object that's a collection of selectors, into an object where
 * every prop is a function bound to the provided state slice. This reduces
 * the boilerplate necessary to colocate reducers while keeping each selector
 * decoupled from the Store schema.
 *
 * @example
 * import * as someSelectors from './whatever'
 * const selectors = bindSelectors('path.to.state.slice', someSelectors)
 *
 * @param {String|Function} context Object path that will get bound to the Selector
 * @param {Object|Function} selectors A collection of selectors or a single function
 * @returns {Object|Function} An object with the same props as the original
 * object, but where every selector is bound to the provided state slice. If a
 * function is passed as the `selectors` arg, the return value is a single
 * function, bound to the provided state slice.
 */
export function bindSelectors(context, selectors) {
  if (!isString(context) && !isFunction(context)) {
    throw new TypeError("Context must be a string or a function");
  }

  if (isFunction(selectors)) {
    return bindSelector(context, selectors);
  }

  return Object.entries(selectors)
    .filter(([_, fn]) => isFunction(fn))
    .reduce((acc, [key, fn]) => {
      acc[key] = bindSelector(context, fn);
      return acc;
    }, {});
}

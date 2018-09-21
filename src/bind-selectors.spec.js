import { bindSelectors } from "./bind-selectors";

describe("bindSelectors", () => {
  test("binds a collection of functions to an object property", () => {
    const obj = { prop: { a: "Hello", b: "World" }, c: "x" };

    const bound = bindSelectors("prop", {
      fn1: state => state.a,
      fn2: state => state.b,
      fn3: state => state.c
    });

    expect(bound.fn1(obj)).toBe("Hello");
    expect(bound.fn2(obj)).toBe("World");
    expect(bound.fn3(obj)).toBe(undefined);
  });

  test("binds a single function to an object property", () => {
    const obj = { prop: "Hello" };

    expect(bindSelectors("prop", i => i)(obj)).toBe("Hello");
  });

  test("path can be defined as a string separated by dots", () => {
    const obj = { path: { to: { some: { prop: "Hello" } } } };

    expect(bindSelectors("path.to", i => i)(obj)).toBe(obj.path.to);
    expect(bindSelectors("path.to.some", i => i.prop)(obj)).toBe("Hello");
    expect(bindSelectors("path.to.unknown", i => i)(obj)).toBe(undefined);
  });

  test("path can be defined as a function", () => {
    const obj = { path: { to: { some: { prop: "Hello" } } } };

    expect(bindSelectors(state => state.path.to.some, i => i.prop)(obj)).toBe(
      "Hello"
    );
  });

  test("extra arguments are passed along to the selector", () => {
    const obj = { a: 1 };
    const selector = (a, b, c) => a + b + c;

    expect(bindSelectors("a", selector)(obj, 2, 3)).toBe(6);
  });

  test("ignores any item in the collection which is not a function", () => {
    const obj = { prop: "Hello" };

    const bound = bindSelectors("prop", {
      fn1: "hello",
      fn2: [1, 2],
      fn3: obj,
      fn4: i => i
    });

    expect(Object.hasOwnProperty.call(bound, "fn1")).toBe(false);
    expect(Object.hasOwnProperty.call(bound, "fn2")).toBe(false);
    expect(Object.hasOwnProperty.call(bound, "fn3")).toBe(false);
    expect(Object.hasOwnProperty.call(bound, "fn4")).toBe(true);
  });

  test("throws TypeError if context is neither a string nor a function", () => {
    const noop = () => {};
    const error = new TypeError("Context must be a string or a function");

    expect(() => bindSelectors(0, noop)).toThrow(error);
    expect(() => bindSelectors({}, noop)).toThrow(error);
    expect(() => bindSelectors([], noop)).toThrow(error);
    expect(() => bindSelectors(true, noop)).toThrow(error);
    expect(() => bindSelectors(error, noop)).toThrow(error);
  });

  test("returns empty object if the collection of selectors is empty or invalid", () => {
    expect(bindSelectors("", {})).toEqual({});
    expect(bindSelectors("", [])).toEqual({});
    expect(bindSelectors("", 1)).toEqual({});
    expect(bindSelectors("", "no")).toEqual({});
    expect(bindSelectors("", false)).toEqual({});
  });
});

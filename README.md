# Bind Selectors

It's a good pattern in Redux to use _selectors_. Amongst other benefits, it keeps the Store shape decoupled from its consumers (e.g. the Components), which in turn helps to have a normalized state shape and change the state without affecting every other part of the application.

However, you shouldn't make the _selector_ aware of the whole state shape. A _selector_ should be [co-located](https://stackoverflow.com/a/41860269) and only care about a particular slice of the state. Computing derived state from multiple sources in the Store should be done by composing _selectors_ instead.

The purpose of this small utility is to reduce the boilerplate required to achieve these good practices, by exposing selectors which are bound to a particular slice of state.

## Installation

```sh
npm install --save @pintob/bind-selectors
```

## API

### `bindSelectors(context, selectors)`

Returns a collection of functions where each function is bound to the provided slice of state. Instead of an object, one can provide a single function, which gets bound as well.

#### Arguments

- `context` (_String_|_Function_): Object path or a mapping function
- `selectors` (_Object_|_Function_): A collection of selectors or a single function

#### Example

```js
// when providing a single selector
const selector = user => user;
const fn = bindSelectors("path.to.user", selector);
fn(state); // sames as: state => state.path.to.user

// when providing a mapping function
const fn = bindSelectors(state => state.path.to.user, selector);
// the return value of the mapping function is
// provided as the argument of the selector
fn(state);
```

## The Gist

```js
// let's consider the following Store shape
const store = {
  entities: {
    user: {},
    events: []
  }
};

// and a couple of co-located selectors
const getOverdueEvents = events => events.filter(ev => ev.dueDate < Date.now());
const getEventsOfType = (events, type) => events.filter(ev => ev.type === type);

// we bind these selectors to their slice of state
const eventSelectors = bindSelectors("entities.events", {
  getOverdueEvents,
  getEventsOfType
});

// so we can then use them elsewhere, by providing the whole state
// but each selector isn't aware of the whole tree, only a subsection
const mapStateToProps = state => ({
  overdueEvents: eventSelectors.getOverdueEvents(state),
  musicEvents: eventSelectors.getEventsOfType(state, "music")
});
```

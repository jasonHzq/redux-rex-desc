import { runLocal } from 'rex';

function Counter({ counter, incCount, decCount }) {
  return (
    <div>
      count: {counter}
      <button onClick={incCount}>Increment</button>
      <button onClick={decCount}>Decrement</button>
    </div>
  );
}

function reducer(state) {
  const { counter } = state;

  return {
    incCount() {
      return { ...state, counter: counter + 1 };
    },
    decCount() {
      return { ...state, counter: counter - 1 };
    },
  };
}

const SmartCounter = runLocal({
  view: Counter,
  initialState: {
    count: 0,
  },
  reducer,
});

export default SmartCounter;

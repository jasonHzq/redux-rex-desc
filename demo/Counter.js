import { run } from 'rex';

function Counter(props) {
  const { tasks, actions, count, num } = props;

  return (
    <div>
      <div className="counter">
        counte: {count}
      </div>
      <input type="number" value={num} onChange={actions.changeNum} />
      <button onClick={actions.addNum.bind(null, 1)}>add one</button>
      <button onClick={tasks.beginAdd}>begin add</button>
      <button onClick={tasks.stopAdd}>stop add</button>
    </div>
  );
}

function tasks(actions) {
  let taskId = null;

  function* countinueAdd() {
    while(true) {
      const num = yield select(state => state.num);
      yield put(actions.addNum(num))
      yield delay(1000);
    }
  };

  return {
    *beginAdd() {
      taskId = yield fork(countinueAdd);
    },
    *stopAdd() {
      if (taskId) {
        yield cancel(taskId);
        taskId = null;
      }
    },
  };
}

function reducer(state) {
  const { count } = state;

  return {
    setCount(count) {
      return {
        ...state,
        count,
      };
    },
    addNum(num) {
      return {
        ...state,
        count: count + num,
      };
    },
    changeNum(e) {
      const num = parseInt(e.target.value, 10);

      return {
        ...state,
        num,
      };
    },
  };
}

export default run({
  view: Counter,
  namespace: 'root/Counter',
  initialState: { count: -1 },
  tasks,
  reducer,

  *init(actions, tasks) {
    const { response, error } = yield Request('/api/getInitCount');

    if (!error) {
      yield put(actions.setCount(response));
    }
  },
})

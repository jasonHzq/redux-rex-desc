import { run } from 'rex';
import { Select, Table } from 'sth-ui-library';

const TYPES = [{
  text: 'a',
  value: 'a',
}, {
  text: 'b',
  value: 'b',
}];

function List(props) {
  const { loading, error, list, type, actions } = props;

  return (
    <div>
      <div className="header">
        <Select options={TYPES} value={type} onChange={actions.changeType} />
      </div>
      <div className="content">
        <Table data={list} columns={SOME_COLUMNS} />
      </div>
    </div>
  );
}

function reducer(state) {
  const { list } = state;

  return {
    changeType(type) {
      return {
        ...state,
        type,
      };
    },
    loadData(isPending, { response, error }) {
      if (isPending) {
        return {
          ...state,
          loading: true,
          error: false,
          msg: '',
        }
      } else if (error) {
        return {
          ...state,
          error: true,
          loading: false,
          msg: error,
        };
      }

      return {
        ...state,
        error: false,
        loading: false,
        msg: '',
        list: resulresponse,
      };
    },
  };
}

function tasks(actions) {
  return {
    *loadData() {
      const type = yield select(state => state.type);

      yield actions.loadData(true);
      const result = yield request('/api/getListByType', {
        params: { type },
      });

      yield actions.loadData(false, result);
    },
  };
}

export default run({
  view: List,
  namespace: 'root/List',
  initialState: {
    list: [],
    type: 'a',
    loading: false,
    msg: '',
    error: false,
  },
  tasks,
  reducer,

  *init(actions, tasks) {
    yield watch(actions.changeType, tasks.loadData);

    yield tasks.loadData;
  },
})

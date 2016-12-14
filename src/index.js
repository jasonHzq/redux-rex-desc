import isGeneratorFunction from 'is-generator-function';
import {  } from 'redux';

import React, { PropTypes, Component } from 'react';

// class Connect extends Component {
//   static context = {
//     store: React.PropTypes.object,
//   };
//
//   render () {
//
//   }
// }

function getTypeByAction() {

}

function getActionByType(namespace, action) {
  return camelCase(action.type).slice(namespace.length);
}

function getReducer(store, options) {
  const { initialState, namespace, reducer } = options;

  return (state = initialState, action) => {
    const { type } = action;

    const actionName = getActionByType(namespace, action);
    const map = reducer(state);

    const updator = map[actionName];

    if updator then
      return updator(action.payload, ...action.meta);
    return state;
  };
}

function getActions(reducer, action, init) {
  const [sagas, normalActions] = classify(action, isGeneratorFunction);

  map(sagas, function(generator, actionName) {
    const constantType = getTypeByAction(actionName);

    yield takeEvery(constantType, generator);
  });

  const mySaga = function* () {
    yield map(sagas, (generator, actionName) => {
      return takeEvery(constantType, generator);
    });
  };

  const actions
}

export default function run({ card, reducer, action, initialState, namespace }) {

}

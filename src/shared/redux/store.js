import AppCfg from 'configs/appConfigs/enviroment';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import staticReducers from './staticReducers';

const sagaMiddleware = createSagaMiddleware();
const STATIC_ROOT_SAGA = '____root';

// sagas manager
const createSagaInjector = (runSaga, rootSaga) => {
  let RunningSagas = {};

  const isInjected = key => RunningSagas[key];

  const injectSagas = sagas => {
    sagas.forEach(({ key, saga }) => {
      if (!isInjected(key)) {
        const task = runSaga(saga);
        RunningSagas[key] = task;
      }
    });
  };

  const ejectSagas = keys => {
    let ejectingKeys = keys;
    if (!keys) {
      ejectingKeys = Object.keys(RunningSagas).filter(key => key !== STATIC_ROOT_SAGA);
    }

    ejectingKeys.forEach(key => {
      const task = RunningSagas[key];
      if (task?.isRunning()) {
        task.cancel();
        delete RunningSagas[key];
      }
    });
  };
  if (rootSaga) {
    injectSagas([{ key: STATIC_ROOT_SAGA, saga: rootSaga }]);
  }
  return { ejectSagas, injectSagas };
};
// reducer manager
const unChangeReducer = currentState => state => state || currentState;
let DynamicReducers = {};
const rootReducer = () =>
  combineReducers({
    ...staticReducers,
    ...DynamicReducers,
  });

const initStore = initialState => {
  const composedEnhancers =
    AppCfg.ENV === 'development'
      ? composeWithDevTools(applyMiddleware(sagaMiddleware))
      : applyMiddleware(sagaMiddleware);

  const store = createStore(rootReducer(), initialState, composedEnhancers);

  // injectingReducers: [{key: string, reducer: (state, action) => state}]
  const injectReducers = (injectingReducers = []) => {
    injectingReducers.forEach(item => {
      DynamicReducers[item.key] = item.reducer;
    });
    store.replaceReducer(rootReducer());
  };

  const ejectReducers = keys => {
    const allState = store.getState();
    if (!keys) {
      return;
    }
    keys.forEach(key => (DynamicReducers[key] = unChangeReducer(allState[key])));
  };

  store.reducerManager = { injectReducers, ejectReducers };
  store.sagaManager = createSagaInjector(sagaMiddleware.run, null);
  return store;
};

const store = initStore({});

export default store;

export const dispatch = store.dispatch;
export const getState = store.getState;

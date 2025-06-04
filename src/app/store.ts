import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import * as Redux from 'redux';
import { save, load } from 'redux-localstorage-simple';

import { createRootReducer } from './rootReducer';

import * as appConstants from '../constants/app';

const logger: Redux.Middleware = (store) => (next) => (action) => {
  console.log('[Redux] prev state', store.getState());
  console.log('[Redux] action\t\t', action);
  const result = next(action);
  console.log('[Redux] next state', store.getState());
  return result;
};

export const history = createBrowserHistory();

export const createStore = () => {
  const middlewares = [routerMiddleware(history)];

  if (process.env.REACT_APP_STORE_LOGGER_MIDDLEWARE) {
    middlewares.push(logger);
  }

  return configureStore({
    reducer: createRootReducer(history),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })
        .concat(middlewares)
        .concat(
          save({
            states: ['app', 'auth'],
            namespace: appConstants.REDUX_LOCAL_STORAGE_SIMPLE_NAMESPACE,
          }),
        ),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: load({
      states: ['app', 'auth'],
      namespace: appConstants.REDUX_LOCAL_STORAGE_SIMPLE_NAMESPACE,
      disableWarnings: false,
    }),
  });
};

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

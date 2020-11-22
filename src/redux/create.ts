import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './modules/reducer';

export default function create() {
  const store = createStore(reducer, composeWithDevTools());

  return store;
}

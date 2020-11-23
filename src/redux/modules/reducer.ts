import { combineReducers } from 'redux';
import books from './books';

const reducer = combineReducers({
  books: books,
});

export type RootState = ReturnType<typeof reducer>;
export default reducer;

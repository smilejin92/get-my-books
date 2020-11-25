import { ActionType, createAction, createReducer } from 'typesafe-actions';

// TYPES
export interface Book {
  authors: string[];
  contents: string;
  datetime: Date;
  isbn: string;
  price: number;
  publisher: string;
  sale_price: number;
  status: string;
  thumbnail: string;
  title: string;
  translators: string[];
  url: string;
}

type BooksAction = ActionType<typeof actions>;

export interface BooksState {
  books: null | Book[];
  filteredBooks: null | Book[];
  page: null | number;
  query: string;
  loading: boolean;
  error: null | Error;
  order: SortOrder;
  priceRange: [min: number, max: number];
}

export enum SortOrder {
  default,
  lowPrice,
  highPrice,
  titleAsc,
  titleDesc,
}

// CONSTANTS
export const MIN_PRICE = -Infinity;
export const MAX_PRICE = Infinity;
const ACTIVE = '정상판매';

// FUNCTIONS
interface SortFuncs {
  [funcName: string]: (b1: Book, b2: Book) => number;
}

export const sortFuncs: SortFuncs = {
  [SortOrder.lowPrice]: (b1: Book, b2: Book): number =>
    getPrice(b1, true) - getPrice(b2, true),
  [SortOrder.highPrice]: (b1: Book, b2: Book): number =>
    getPrice(b2, false) - getPrice(b1, false),
  [SortOrder.titleAsc]: (b1: Book, b2: Book): number =>
    b1.title < b2.title ? -1 : b1.title > b2.title ? 1 : 0,
  [SortOrder.titleDesc]: (b1: Book, b2: Book): number =>
    b1.title > b2.title ? -1 : b1.title < b2.title ? 1 : 0,
};

export const filterPrice = (minPrice: number, maxPrice: number) => ({
  status,
  price,
  sale_price,
}: Book): boolean => {
  if (status === ACTIVE) {
    return sale_price > 0
      ? minPrice <= sale_price && sale_price <= maxPrice
      : minPrice <= price && price <= maxPrice;
  }
  return false;
};

const getPrice = (book: Book, infinityType: boolean): number =>
  book.status === ACTIVE
    ? book.sale_price > 0
      ? book.sale_price
      : book.price
    : infinityType
    ? Infinity
    : -Infinity;

// ACTIONS
// const prefix = 'get-my-books/books';
const FETCH_BOOKS_START = `get-my-books/books/FETCH_BOOKS_START`;
const FETCH_BOOKS_SUCCESS = `get-my-books/books/FETCH_BOOKS_SUCCESS`;
const FETCH_BOOKS_FAILURE = `get-my-books/books/FETCH_BOOKS_FAILURE`;
const SET_QUERY = `get-my-books/books/SET_QUERY`;
const RESET_STATE = `get-my-books/books/RESET_STATE`;
const LOAD_MORE_BOOKS = `get-my-books/books/LOAD_MORE_BOOKS`;
const SORT_BOOKS = `get-my-books/books/SORT_BOOKS`;
const SET_PRICE = `get-my-books/books/SET_PRICE`;

// ACTION CREATORS
export const fetchBooksStart = createAction(FETCH_BOOKS_START)();
export const fetchBooksSuccess = createAction(FETCH_BOOKS_SUCCESS)<Book[]>();
export const fetchBooksFailure = createAction(FETCH_BOOKS_FAILURE)<Error>();
export const setQuery = createAction(SET_QUERY)<string>();
export const resetState = createAction(RESET_STATE)();
export const loadMoreBooks = createAction(LOAD_MORE_BOOKS)();
export const sortBooks = createAction(SORT_BOOKS)<number>();
export const setPrice = createAction(SET_PRICE)<[min: number, max: number]>();

const actions = {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure,
  setQuery,
  resetState,
  loadMoreBooks,
  sortBooks,
  setPrice,
};

// INITIAL STATE
const initialState: BooksState = {
  books: null,
  filteredBooks: null,
  page: null,
  query: '',
  loading: false,
  error: null,
  order: SortOrder.default,
  priceRange: [MIN_PRICE, MAX_PRICE],
};

// REDUCER
const books = createReducer<BooksState, BooksAction>(initialState, {
  [FETCH_BOOKS_START]: state => ({ ...state, loading: true, error: null }),
  [FETCH_BOOKS_SUCCESS]: (state, { payload }) => ({
    ...state,
    books: payload,
    filteredBooks: payload,
    loading: false,
    error: null,
    page: 1,
    order: SortOrder.default,
    priceRange: [MIN_PRICE, MAX_PRICE],
  }),
  [FETCH_BOOKS_FAILURE]: (state, { payload }) => ({
    ...initialState,
    error: payload,
    query: state.query,
  }),
  [SET_QUERY]: (_, { payload }) => ({ ...initialState, query: payload }),
  [RESET_STATE]: () => ({ ...initialState }),
  [LOAD_MORE_BOOKS]: state => ({ ...state, page: (state.page as number) + 1 }),
  [SORT_BOOKS]: (state, { payload }) => {
    const [minPrice, maxPrice] = state.priceRange;
    const filteredBooks =
      payload === SortOrder.default
        ? minPrice === MIN_PRICE && maxPrice === MAX_PRICE
          ? state.books
          : (state.books as Book[]).filter(filterPrice(minPrice, maxPrice))
        : [...(state.filteredBooks as Book[])].sort(sortFuncs[payload]);

    return {
      ...state,
      order: payload,
      filteredBooks,
    };
  },
  [SET_PRICE]: (state, { payload }) => {
    const [minPrice, maxPrice] = payload;
    const filteredBooks =
      minPrice === MIN_PRICE && maxPrice === MAX_PRICE
        ? state.books
        : (state.books as Book[]).filter(filterPrice(minPrice, maxPrice));

    const sortedBooks =
      state.order === SortOrder.default
        ? filteredBooks
        : (filteredBooks as Book[]).sort(sortFuncs[state.order]);

    return {
      ...state,
      priceRange: payload,
      filteredBooks: sortedBooks,
    };
  },
});

// // SAGA ACTIONS
// const FETCH_BOOKS = `${prefix}/FETCH_BOOKS`;
// export const fetchBooks = createAction(FETCH_BOOKS);

// // SAGA FUNCTIONS
// function* fetchBooksSaga() {
//   try {
//     yield put(fetchBooksStart());
//     const query = yield select(({ books }) => books.query);

//     const list = [];
//     let page = 1;
//     const { data } = yield call(Kakao.fetchBooks, query, page);
//     list.push(...data.documents);
//     let { is_end } = data.meta;

//     while (!is_end) {
//       page += 1;
//       const { data } = yield call(Kakao.fetchBooks, query, page);
//       list.push(...data.documents);
//       is_end = data.meta.is_end;
//     }

//     yield delay(1000);
//     yield put(fetchBooksSuccess(list));
//   } catch (err) {
//     yield put(fetchBooksFailure(err));
//     console.error(err);
//   }
// }

// // ROOT SAGA
// export function* booksSaga() {
//   yield takeLatest(FETCH_BOOKS, fetchBooksSaga);
// }

export default books;

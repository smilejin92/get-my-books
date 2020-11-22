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

type BooksAction =
  | ReturnType<typeof fetchBooksStart>
  | ReturnType<typeof fetchBooksSuccess>
  | ReturnType<typeof fetchBooksFailure>
  | ReturnType<typeof setQuery>
  | ReturnType<typeof resetState>
  | ReturnType<typeof loadMoreBooks>
  | ReturnType<typeof sortBooks>
  | ReturnType<typeof setPrice>;

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

// UTILS
export const MIN_PRICE = -Infinity;
export const MAX_PRICE = Infinity;
const ACTIVE = '정상판매';

export const sortFuncs = {
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
const FETCH_BOOKS_START = `get-my-books/books/FETCH_BOOKS_START` as const;
const FETCH_BOOKS_SUCCESS = `get-my-books/books/FETCH_BOOKS_SUCCESS` as const;
const FETCH_BOOKS_FAILURE = `get-my-books/books/FETCH_BOOKS_FAILURE` as const;
const SET_QUERY = `get-my-books/books/SET_QUERY` as const;
const RESET_STATE = `get-my-books/books/RESET_STATE` as const;
const LOAD_MORE_BOOKS = `get-my-books/books/LOAD_MORE_BOOKS` as const;
const SORT_BOOKS = `get-my-books/books/SORT_BOOKS` as const;
const SET_PRICE = `get-my-books/books/SET_PRICE` as const;

// ACTION CREATORS
export const fetchBooksStart = () => ({
  type: FETCH_BOOKS_START,
});

export const fetchBooksSuccess = (books: Book[]) => ({
  type: FETCH_BOOKS_SUCCESS,
  payload: books,
});

export const fetchBooksFailure = (error: Error) => ({
  type: FETCH_BOOKS_FAILURE,
  payload: error,
});

export const setQuery = (query: string) => ({
  type: SET_QUERY,
  payload: query,
});

export const resetState = () => ({
  type: RESET_STATE,
});

export const loadMoreBooks = () => ({
  type: LOAD_MORE_BOOKS,
});

export const sortBooks = (order: SortOrder) => ({
  type: SORT_BOOKS,
  payload: order,
});

export const setPrice = (priceRange: [min: number, max: number]) => ({
  type: SET_PRICE,
  payload: priceRange,
});

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
function books(
  state: BooksState = initialState,
  action: BooksAction,
): BooksState {
  switch (action.type) {
    case FETCH_BOOKS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_BOOKS_SUCCESS:
      return {
        ...state,
        books: action.payload,
        filteredBooks: action.payload,
        loading: false,
        error: null,
        page: 1,
        order: SortOrder.default,
        priceRange: [MIN_PRICE, MAX_PRICE],
      };

    case FETCH_BOOKS_FAILURE:
      return {
        ...initialState,
        error: action.payload,
        query: state.query,
      };

    case SET_QUERY:
      return {
        ...initialState,
        query: action.payload,
      };

    case RESET_STATE:
      return {
        ...initialState,
      };

    case LOAD_MORE_BOOKS:
      return {
        ...state,
        page: (state.page as number) + 1,
      };

    case SORT_BOOKS: {
      const [minPrice, maxPrice] = state.priceRange;
      const filteredBooks =
        action.payload === SortOrder.default
          ? minPrice === MIN_PRICE && maxPrice === MAX_PRICE
            ? state.books
            : (state.books as Book[]).filter(filterPrice(minPrice, maxPrice))
          : [...(state.filteredBooks as Book[])].sort(
              sortFuncs[action.payload],
            );

      return {
        ...state,
        order: action.payload,
        filteredBooks,
      };
    }

    case SET_PRICE: {
      const [minPrice, maxPrice] = action.payload;
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
        priceRange: action.payload,
        filteredBooks: sortedBooks,
      };
    }

    default:
      return state;
  }
}

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

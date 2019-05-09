import React from 'react';

const BookmarkContext = React.createContext({
  addBookmark: () => {},
  deleteBookmark: () => {},
  changePage: () => {},
  editBookmark: () => {}
});

export default BookmarkContext;

import React, { Component } from 'react';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';
import BookmarkContext from './bookmark-context';

const bookmarks = [
  // {
  //   id: 0,
  //   title: 'Google',
  //   url: 'http://www.google.com',
  //   rating: '3',
  //   desc: 'Internet-related services and products.'
  // },
  // {
  //   id: 1,
  //   title: 'Thinkful',
  //   url: 'http://www.thinkful.com',
  //   rating: '5',
  //   desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
  // },
  // {
  //   id: 2,
  //   title: 'Github',
  //   url: 'http://www.github.com',
  //   rating: '4',
  //   desc: 'brings together the world\'s largest community of developers.'
  // }
];

class App extends Component {
  state = {
    page: 'list',
    bookmarks,
    error: null,
    isEditing: false,
    bookmarkId: undefined
  };

  listBookmarks = () => {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  changePage = (page, options={}) => {
    const {isEditing, bookmarkId} = options;
    if (page === 'list') {
      this.setState({page, isEditing, bookmarkId}, this.listBookmarks)
    } else {
      this.setState({ page, isEditing, bookmarkId })
    }
    
  }

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
      page: 'list',
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  deleteBookmark = async (id) => {
    try {
      await fetch(`${config.API_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${config.API_KEY}`
        }
      })
      this.setState({
        bookmarks: this.state.bookmarks.filter(bookmark => bookmark.id !== id)
      })
    } catch(err) {
      this.setState({error: err.message})
    }
  }

  editBookmark = async (id, data) => {
    let error;
    
    const patchRes = await fetch(`${config.API_ENDPOINT}/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      },
      body: JSON.stringify(data)
    })

    if (!patchRes.ok) {
      error = await patchRes.json()
      throw new Error(error.message)
    }

    const bookmarkRes = await fetch(`${config.API_ENDPOINT}/${id}`, {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    });

    if (!bookmarkRes.ok) {
      error = await bookmarkRes.json()
      throw new Error(error.message)
    }
    
    const updatedBookmark = await bookmarkRes.json();
    this.setState({
      bookmarks: this.state.bookmarks.map(bookmark => bookmark.id === id ? updatedBookmark : bookmark)
    }, this.changePage('list', {isEditing: false}))
  }

  componentDidMount() {
    this.listBookmarks();
  }

  render() {
    const { page, bookmarks } = this.state
    return (
      <BookmarkContext.Provider value={{
        addBookmark: this.addBookmark,
        deleteBookmark: this.deleteBookmark,
        changePage: this.changePage,
        editBookmark: this.editBookmark,
      }}>
        <main className='App'>
          <h1>Bookmarks!</h1>
          <Nav clickPage={this.changePage} />
          <div className='content' aria-live='polite'>
            {page === 'add' && (
              <AddBookmark
                onAddBookmark={this.addBookmark}
                onClickCancel={() => this.changePage('list')}
                isEditing={this.state.isEditing}
                bookmarkId={this.state.bookmarkId}
              />
            )}
            {page === 'list' && (
              <BookmarkList
                bookmarks={bookmarks}
              />
            )}
          </div>
        </main>
      </BookmarkContext.Provider>
    );
  }
}

export default App;

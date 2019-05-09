import React, { Component } from  'react';
import config from '../config'
import './AddBookmark.css';
import BookmarkContext from '../bookmark-context';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class AddBookmark extends Component {
  static contextType = BookmarkContext;

  state = {
    error: null,
    title: '',
    url: '',
    desc: '',
    rating: 1,
  };

  async componentDidMount() {
    if (this.props.isEditing) {
      try {
        const res = await fetch(`${config.API_ENDPOINT}/${this.props.bookmarkId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.API_KEY}`
          }
        })

        if (!res.ok) {
          throw new Error(res.status)
        }
        const bookmark = await res.json()
        const {title, url, rating} = bookmark;
        const desc = bookmark.desc ? bookmark.desc : '';
        this.setState({title, url, desc, rating})
      } catch(err) {
        this.setState({error: err.message})
      }
    }
  }

  updateField = (e) => {
    const {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const {title, url, desc, rating} = this.state;
    const bookmark = {title, url, desc, rating};

    if (this.props.isEditing) {
      try {
        this.context.editBookmark(this.props.bookmarkId, bookmark)
      } catch(err) {
        this.setState({error: err.message})
      }
      
    } else {
      this.setState({ error: null })
      fetch(config.API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(bookmark),
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${config.API_KEY}`
        }
      })
        .then(res => {
          if (!res.ok) {
            // get the error message from the response,
            return res.json().then(error => {
              // then throw it
              throw error
            })
          }
          return res.json()
        })
        .then(data => {
          this.context.changePage('list');
        })
        .catch(error => {
          this.setState({ error })
        })
    }
  }

  render() {
    const { error } = this.state
    const { onClickCancel } = this.props
    return (
      <section className='AddBookmark'>
        <h2>Create a bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={this.state.title}
              onChange={(e) => this.updateField(e)}
              placeholder='Great website!'
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value={this.state.url}
              onChange={(e) => this.updateField(e)}
              placeholder='https://www.great-website.com/'
              required
            />
          </div>
          <div>
            <label htmlFor='desc'>
              Description
            </label>
            <textarea
              name='desc'
              id='desc'
              value={this.state.desc}
              onChange={(e) => this.updateField(e)}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              value={this.state.rating}
              onChange={(e) => this.updateField(e)}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={onClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default AddBookmark;

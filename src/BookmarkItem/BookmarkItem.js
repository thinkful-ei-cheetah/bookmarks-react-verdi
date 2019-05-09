import React from 'react';
import Rating from '../Rating/Rating';
import './BookmarkItem.css';
import BookmarkContext from '../bookmark-context';

export default class BookmarkItem extends React.Component {
  static contextType = BookmarkContext;

  render() {
    return (
      <li className='BookmarkItem'>
        <div className='BookmarkItem__row'>
          <h3 className='BookmarkItem__title'>
            <a
              href={this.props.url}
              target='_blank'
              rel='noopener noreferrer'>
              {this.props.title}
            </a>
          </h3>
          <Rating value={this.props.rating} />
        </div>
        <p className='BookmarkItem__description'>
          {this.props.description}
        </p>
        <div className='BookmarkItem__buttons'>
        <button
            className='BookmarkItem__description'
            onClick={() => this.context.changePage('add', {isEditing: true, bookmarkId: this.props.id})}
          >
            Edit
          </button>
          <button
            className='BookmarkItem__description'
            onClick={() => this.context.deleteBookmark(this.props.id)}
          >
            Delete
          </button>
        </div>
      </li>
    )
  } 
}

// BookmarkItem.defaultProps = {}

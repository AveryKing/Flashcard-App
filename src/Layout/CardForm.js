import React from 'react';
import { useHistory, Link } from 'react-router-dom';

const CardForm = ({  handleChange, handleSubmit, deckId, newCardData}) => {
  const history = useHistory();
  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='front'>Front</label>
        <textarea
          className='form-control'
          id='front'
          name='front'
          rows='5'
          placeholder='Front side of card'
          onChange={handleChange}
          value={newCardData.front}
          required
        ></textarea>
      </div>
      <div className='form-group'>
        <label htmlFor='back'>Back</label>
        <textarea
          className='form-control'
          id='back'
          name='back'
          rows='5'
          placeholder='Back side of card'
          onChange={handleChange}
          value={newCardData.back}
          required
        ></textarea>
      </div>
      <Link to={`/decks/${deckId}`} className='mr-2'>
        <button
          type='button'
          className='btn btn-secondary'
          onClick={() => history.push(`/decks/${deckId}`)}
        >
          Cancel
        </button>
      </Link>
      <button type='submit' className='btn btn-primary'>
        Add Card
      </button>
    </form>
  );
}

export default CardForm;

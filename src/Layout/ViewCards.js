import React from 'react';
import { useHistory, useRouteMatch, Link } from 'react-router-dom';
import { deleteCard } from '../utils/api';

const ViewCards = ({ cards = [] }) => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const handleDelete = async (cardId) => {
    const response = window.confirm(
      'Delete this card? \n\nYou will not be able to recover it.'
    );
    if (response) {
      await deleteCard(cardId);
      history.go(0);
    }
  };

  const displayCards = cards.map((card, index) => (
    <div key={index} className='card'>
      <div className='card-body'>
          <div className='col-5'><h4>{card.front}</h4></div>
          <div className='col-5 ml-1'>
           <h6>{card.back}</h6> 
            <div>
              <Link to={`${url}/cards/${card.id}/edit`}>
                <button className='btn btn-secondary m-2'>
                  <i className='fas fa-edit'></i> Edit
                </button>
              </Link>
              <button
                className='btn btn-danger '
                onClick={() => handleDelete(card.id)}
              >
                <i className='fas fa-trash'></i> Delete
              </button>
          </div>
        </div>
      </div>
    </div>
  ));
  if(cards.length > 0) {
    return (
      <>
        <div className='card'>
          <div className='card-header '>
            <h3>Cards</h3>
          </div>
        </div>
        {displayCards}
      </>
    );
  } else {
    return (
      <>
        <div className='card'>
          <div className='card-header '>
            <h3>Cards</h3>
            
          </div>
          <blockquote className='blockquote mb-0 mt-2 ml-2'>
            <p>This deck does not have any cards yet.</p>
          </blockquote>   </div>
        
      </>
    );
  }

}

export default ViewCards;

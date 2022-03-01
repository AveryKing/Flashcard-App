import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { deleteDeck, listDecks } from '../utils/api/index.js';

const Home = () => {
  const mountedRef = useRef(false);
  const [decks, setDecks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDecks() {
      try {
        const decks = await listDecks();
        if (mountedRef.current) {
          setDecks((_) => [...decks]);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          throw error;
        }
      }
    }
    loadDecks();

    return () => abortController.abort();
  }, []);


  const handleDelete = async (deckId) => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this deck?\n\n You will not be able to recover it.'
    );
    if (confirmation) {
      await deleteDeck(deckId);
      history.go(0);
    }
  };

  const displayDecks = decks.map((deck) => (
    <div
      key={deck.id}
      className='card'
      style={{ width: '100%', marginTop: '1em' }}
    >
      <div className='card-body'>
        <div className='d-flex justify-content-start'>
          <h4 className='card-title mr-5 '>{deck.name}</h4>
          <p className="mt-1">{deck.cards.length} cards</p>
        </div>
        <h5 className='card-text'>{deck.description}</h5>
        <div className='d-flex justify-content-start mt-4'>
          <Link to={`/decks/${deck.id}`} className='card-link'>
            <button
              className='btn btn-secondary'
              onClick={() => history.push(`/decks/${deck.id}`)}
            >
              <i className='fas fa-eye'></i> View
            </button>
          </Link>
          <Link to={`/decks/${deck.id}/study`} className='card-link'>
            <button
              className='btn btn-primary'
              onClick={() => history.push(`/decks/${deck.id}/study`)}
            >
              <i className='fas fa-book'></i> Study
            </button>
          </Link>
          <Link to='#' className='card-link'>
            <button
              className='btn btn-danger'
              onClick={() => handleDelete(deck.id)}
            >
              <i className='fas fa-trash'></i> Delete
            </button>
          </Link>
        </div>
      </div>
    </div>
  ));

  return decks ? (
    <>{displayDecks}</>
  ) : (
    <p>Loading...</p>
  );
}

export default Home;
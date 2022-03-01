import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useHistory, Route } from 'react-router-dom';
import { deleteDeck, readDeck } from '../utils/api';
import ViewCards from './ViewCards';

const ViewDeck = () =>{
  const mountedRef = useRef(false);
  const { deckId } = useParams();
  const history = useHistory();
  const [deck, setDeck] = useState({ name: 'loading...', cards: [] });

 

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        if (mountedRef.current) {
          setDeck(() => ({ ...response }));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          throw error;
        }
      }
    }
    loadDeck();
    return () => {
      abortController.abort();
    };
  }, [deckId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {

      mountedRef.current = false;
    };
  }, []);

  const handleDelete = async (deckId) => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this deck?\n\n You will not be able to recover it.'
    );
    if (confirmation) {
      await deleteDeck(deckId);
      history.push('/');
    }
  };

  return (
    <>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>
              <i className='fas fa-home'></i> Home
            </Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            {deck.name}
          </li>
        </ol>
      </nav>
      <div className='card'>
        <div className='card-header'>
          <h3>{deck.name}</h3>
        </div>
        <div className='card-body'>
          <blockquote className='blockquote mb-0'>
            <p>{deck.description}</p>
          </blockquote>
          <div className='d-flex justify-content-start '>
            <Link to={`/decks/${deck.id}/edit`}>
              <button
                className='btn btn-secondary mr-3'
                onClick={() => history.push(`/decks/${deck.id}/edit`)}
              >
                <i className='fas fa-edit'></i> Edit
              </button>
            </Link>
            <Link to={`/decks/${deck.id}/study`}>
              <button
                type='button'
                className='btn btn-primary mr-3'
                onClick={() => history.push(`/decks/${deck.id}/study`)}
              >
                <i className='fas fa-book'></i> Study
              </button>
            </Link>
            <Link to={`/decks/${deck.id}/cards/new`}>
              <button
                type='button'
                className='btn btn-primary'
                onClick={() => history.push(`/decks/${deck.id}/cards/new`)}
              >
                <i className='fas fa-plus'></i> Add Card
              </button>
            </Link>
            <button
            
              type='button'
              className='btn btn-danger ml-3'
              onClick={() => handleDelete(deckId)}
            >
              <i className='fas fa-trash'></i>Delete
            </button>
          </div>
        </div>
      </div>
      <Route>
        <ViewCards cards={deck.cards} />
      </Route>
    </>
  );
}

export default ViewDeck;

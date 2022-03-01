import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { readDeck, readCard, updateCard } from '../utils/api';
import CardForm from './CardForm';

const EditCard = () => {
  const history = useHistory();

  const mountedRef = useRef(false);
  const initialCardState = { id: '', front: '', back: '', deckId: '' };
  const [editCard, setEditCard] = useState(initialCardState);

  const { deckId, cardId } = useParams();

  const [deck, setDeck] = useState({
    name: 'loading...',
    description: '',
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        if (mountedRef.current) {
          setDeck(() => loadedDeck);
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
    const abortController = new AbortController();
    async function loadCard() {
      try {
        const loadedCard = await readCard(cardId, abortController.signal);
        if (mountedRef.current) {
          setEditCard(() => loadedCard);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          throw error;
        }
      }
    }
    loadCard();
    return () => {
      abortController.abort();
    };
  }, [cardId]);

  const handleChange = ({ el }) => {
    setEditCard((currentState) => ({
      ...currentState,
      [el.name]: el.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preDefault();
    await updateCard(editCard);
    setEditCard(initialCardState);
    history.push(`/decks/${deckId}`);
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
          <li className='breadcrumb-item'>
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Edit Card {cardId}
          </li>
        </ol>
      </nav>
      <h1 className='text-center'>Edit Card</h1>
      <CardForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        newCardData={editCard}
        deckId={deckId}
      />
    </>
  );
}

export default EditCard;

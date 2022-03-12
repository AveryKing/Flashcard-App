import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { readDeck, createCard } from '../utils/api';
import CardForm from './CardForm';


const AddCard = () => {
  const initialFormState = {
    id: '',
    front: '',
    back: '',
    deckId: '',
  };
  const { deckId } = useParams();

  const history = useHistory();

  const [newCardData, setNewCardData] = useState(initialFormState);

  const mountedRef = useRef(false);
  const [deck, setDeck] = useState({
    name: 'Loading...',
    description: '',
    cards: [],
  });




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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCard(deckId, newCardData);
    setNewCardData(initialFormState);
    history.go(0);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleChange = ({ target }) => {
    setNewCardData((currentState) => ({
      ...currentState,
      [target.name]: target.value,
    }));
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
            Edit Deck
          </li>
        </ol>
      </nav>
      <h1 className='my-4 '>
        <span>'{deck.name}': </span><span>Add card</span>
      </h1>
      <CardForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        newCardData={newCardData}
        deckId={deckId}
      />
    </>
  );
}

export default AddCard;

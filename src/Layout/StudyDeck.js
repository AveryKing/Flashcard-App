import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readDeck } from '../utils/api';

const StudyDeck = ()  => {
  const mountedRef = useRef(false);
  const initialState = {
    deck: { name: 'Loading...', cards: [] },
    isCardFlipped: false,
    currentIndex: 0,
  };

  const [studyDeckState, setStudyDeckState] = useState(initialState);
  const { deck, isCardFlipped, currentIndex } = studyDeckState;

  const { deckId } = useParams();

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
          setStudyDeckState((currentState) => ({
            ...currentState,
            deck: loadedDeck,
          }));
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

  function handleFlip() {
    setStudyDeckState({
      ...studyDeckState,
      isCardFlipped: !studyDeckState['isCardFlipped'],
    });
  }

  function handleNext() {
    const { cards } = deck;
    if (currentIndex === cards.length - 1) {
      const response = window.confirm(
        'Do you want to go back to the beginning of the deck?'
      );
      if (response) {
        setStudyDeckState((currentState) => ({
          ...currentState,
          currentIndex: 0,
        }));
      }
    } else {
      setStudyDeckState((currentState) => ({
        ...currentState,
        currentIndex: currentState.currentIndex++,
        isCardFlipped: !currentState.isCardFlipped,
      }));
    }
  }

  const breadcrumb = (
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
          Study
        </li>
      </ol>
    </nav>
  );

  if (deck.cards.length <= 2) {
    return (
      <>
        {breadcrumb}
        <div className='card'>
          <div className='card-body'>
            <h2>Study '{deck.name}'</h2>
            <h3 className='card-title'>Not enough cards!</h3>
            <p className='card-text'>
              You need at least 3 cards to study this deck. Please add more cards.
            </p>
            <Link to={`/decks/${deckId}/cards/new`}>
              <button type='button' className='btn btn-primary'>
                <i className='fas fa-plus'></i> Add Card
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {breadcrumb}
        <h2 >{deck.name} - Study </h2>
        <div className='card'>
          <div className='card-body'>
            <h5 className='card-title'>
              Card {currentIndex + 1} of {deck.cards.length}
            </h5>
            <h5 className='card-text'>
              {!isCardFlipped
                ? `Front: ${deck.cards[currentIndex].front}`
                : `Back: ${deck.cards[currentIndex].back}`}
            </h5>
          </div>
       
        </div>
        <div className="d-flex mt-2">
        <button
            type='button'
            className='btn btn-secondary mr-2'
            onClick={() => handleFlip()}
          >
            Flip
          </button>
          {isCardFlipped && (
            <button
              className='btn btn-primary'
              onClick={handleNext}
            >
              Next
            </button>
          )}
          </div>
      </>
    );
  }
}

export default StudyDeck;

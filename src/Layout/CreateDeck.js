import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createDeck } from '../utils/api';

const CreateDeck = () => {
  const history = useHistory();

  const initialFormState = {
    name: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);


  const handleChangeName = ({target}) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      name: target.value,
    }));
  };
  const handleChangeDescription = ({target}) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      description: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createDeck(formData);
    setFormData(initialFormState);
    history.push(`/decks/${response.id}`);
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
            Create Deck
          </li>
        </ol>
      </nav>
      <form onSubmit={handleSubmit}>
        <h1 className='my-4 '>Create Deck</h1>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            name='name'
            id='name'
            className='form-control'
            type='text'
            placeholder='Deck Name'
            onChange={handleChangeName}
            value={formData.name}
            required
          ></input>
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            className='form-control'
            id='description'
            name='description'
            rows='4'
            placeholder='Brief description of the deck'
            onChange={handleChangeDescription}
            value={formData.description}
            required
          ></textarea>
        </div>
        <Link to='/' className='mr-2'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => history.push('/')}
          >
            Cancel
          </button>
        </Link>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </>
  );
}

export default CreateDeck;
